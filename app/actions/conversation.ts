"use server";

import { revalidatePath } from "next/cache";
import { Op } from "sequelize";
import { z } from "zod";
import Contact from "@/models/Contact";
import Conversation from "@/models/Conversation";
import ConversationContact from "@/models/ConversationContact";
import sequelize from "@/models/connection";
import { getSession } from "../Service/session";

export type ContactSearchResult = {
  id: number;
  nickname: string;
};

export type CreateConversationState = {
  success?: boolean;
  message?: string;
};

export async function searchContacts(query: string): Promise<ContactSearchResult[]> {
  const session = await getSession();

  if (!session) {
    return [];
  }

  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) {
    return [];
  }

  const contacts = await Contact.findAll({
    attributes: ["id", "nickname"],
    where: {
      id: { [Op.ne]: session.userId },
      nickname: { [Op.like]: `%${normalizedQuery}%` },
    },
    order: [["nickname", "ASC"]],
    limit: 10,
    raw: true,
  });

  return contacts.map((contact) => ({
    id: contact.id,
    nickname: contact.nickname,
  }));
}

const selectedContactsSchema = z
  .array(z.coerce.number().int().positive())
  .min(1, "Sélectionnez au moins un contact.")
  .max(20, "Une conversation ne peut pas dépasser 20 contacts.");

export async function createConversation(
  _previousState: CreateConversationState,
  formData: FormData,
): Promise<CreateConversationState> {
  const session = await getSession();

  if (!session) {
    return { message: "Votre session a expiré. Veuillez vous reconnecter." };
  }

  const validation = selectedContactsSchema.safeParse(
    [...new Set(formData.getAll("contactIds"))],
  );

  if (!validation.success) {
    return { message: validation.error.issues[0]?.message };
  }

  const selectedIds = validation.data.filter((id) => id !== session.userId);
  const contacts = await Contact.findAll({
    attributes: ["id"],
    where: { id: { [Op.in]: selectedIds } },
    raw: true,
  });

  if (contacts.length !== selectedIds.length || selectedIds.length === 0) {
    return { message: "Un ou plusieurs contacts sélectionnés sont invalides." };
  }

  try {
    await sequelize.transaction(async (transaction) => {
      const conversation = await Conversation.create({}, { transaction });
      const participantIds = [session.userId, ...selectedIds];

      await ConversationContact.bulkCreate(
        participantIds.map((contactId) => ({
          conversationId: conversation.id,
          contactId,
        })),
        { transaction },
      );
    });
  } catch (error) {
    console.error("Erreur pendant la création de la conversation :", error);
    return { message: "Impossible de créer la conversation pour le moment." };
  }

  revalidatePath("/Dashboard");
  return { success: true, message: "Conversation créée." };
}
