import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Op } from "sequelize";
import NewConversation from "../Components/NewConversation";
import { getSession } from "../Service/session";
import Contact from "@/models/Contact";
import Conversation from "@/models/Conversation";
import ConversationContact from "@/models/ConversationContact";

export const metadata: Metadata = {
  title: "Mes conversations",
  description: "Retrouvez et créez vos conversations.",
};

type ConversationItem = {
  id: number;
  createdAt: string;
  participants: { id: number; nickname: string }[];
};

async function getUserConversations(userId: number): Promise<ConversationItem[]> {
  const memberships = await ConversationContact.findAll({
    attributes: ["conversationId"],
    where: { contactId: userId },
    raw: true,
  });
  const conversationIds = memberships.map(({ conversationId }) => conversationId);

  if (conversationIds.length === 0) return [];

  const [conversations, allMemberships] = await Promise.all([
    Conversation.findAll({
      where: { id: { [Op.in]: conversationIds } },
      order: [["updatedAt", "DESC"]],
      raw: true
    }),
    ConversationContact.findAll({
      attributes: ["conversationId", "contactId"],
      where: { conversationId: { [Op.in]: conversationIds } },
      raw: true,
    }),
  ]);

  const participantIds = [
    ...new Set(allMemberships.map(({ contactId }) => contactId)),
  ];
  const contacts = await Contact.findAll({
    attributes: ["id", "nickname"],
    where: { id: { [Op.in]: participantIds } },
    raw: true,
  });
  const contactsById = new Map(contacts.map((contact) => [contact.id, contact]));

  return conversations.map((conversation) => ({
    id: conversation.id,
    createdAt: conversation.createdAt.toISOString(),
    participants: allMemberships
      .filter(({ conversationId }) => conversationId === conversation.id)
      .map(({ contactId }) => contactsById.get(contactId))
      .filter((contact): contact is Contact => Boolean(contact))
      .map(({ id, nickname }) => ({ id, nickname })),
  }));
}

function formatConversationDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/Auth/Login");
  }

  const conversations = await getUserConversations(session.userId);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold uppercase text-white shadow-lg shadow-indigo-600/20">
              {session.nickname.slice(0, 1)}
            </span>
            <div>
              <p className="text-xs font-medium text-slate-400">Connecté en tant que</p>
              <p className="text-sm font-bold text-slate-800">{session.nickname}</p>
            </div>
          </div>
          <NewConversation />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600">Messagerie</p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mes conversations</h1>
              <p className="mt-2 text-sm text-slate-500">
                {conversations.length} conversation{conversations.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {conversations.length === 0 ? (
          <section className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-8 w-8">
                <path d="M8 19H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-7l-4 3v-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="text-lg font-bold text-slate-800">Aucune conversation</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Créez votre première conversation et invitez un ou plusieurs contacts à vous rejoindre.
            </p>
            <div className="mt-6"><NewConversation /></div>
          </section>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {conversations.map((conversation) => {
              const others = conversation.participants.filter(({ id }) => id !== session.userId);
              const title = others.map(({ nickname }) => nickname).join(", ") || "Conversation personnelle";

              return (
                <li key={conversation.id}>
                  <article className="group h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex -space-x-2">
                        {others.slice(0, 3).map((contact, index) => (
                          <span key={contact.id} style={{ zIndex: 3 - index }} className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold uppercase text-white">
                            {contact.nickname.slice(0, 1)}
                          </span>
                        ))}
                        {others.length > 3 && (
                          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-bold text-slate-500">
                            +{others.length - 3}
                          </span>
                        )}
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        #{conversation.id}
                      </span>
                    </div>
                    <h2 className="mt-5 truncate text-base font-bold text-slate-800" title={title}>{title}</h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {conversation.participants.length} participant{conversation.participants.length > 1 ? "s" : ""} · créée le {formatConversationDate(conversation.createdAt)}
                    </p>
                    <div className="mt-5 border-t border-slate-100 pt-4 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      {conversation.participants.length > 2 ? "Conversation de groupe" : "Conversation directe"}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
