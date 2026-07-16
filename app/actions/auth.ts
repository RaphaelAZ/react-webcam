"use server";

import argon2 from "argon2";
import { AuthState } from "./auth.type";
import { z } from "zod";
import Contact from "@/models/Contact";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/models/connection";
import { createSession } from "../Service/session";

connectToDatabase();

const authSchema = z.object({
    nickname: z.string().trim().min(3, "Le pseudo doit comporter au moins 3 caractères"),
    password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères")
});

export async function register(state: AuthState, formdata: FormData): Promise<AuthState> {
    const validation = authSchema.safeParse({
        nickname: formdata.get("nickname"),
        password: formdata.get("password")
    });

    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
            message: "Le formulaire contient des erreurs"
        }
    }

    const { nickname, password } = validation.data;

    const existingUser = await Contact.findOne({
        where: { nickname },
        raw: true
    });

    if (existingUser) {
        return {
            errors: {
                nickname: ["Un compte existe déjà avec ce pseudo"]
            }
        }
    }

    try {
        const hash = await argon2.hash(password);

        const user = await Contact.create({
            nickname,
            password: hash
        });
    } catch (error) {
        console.error("Erreur pendant l'inscription :", error);
        return {
            message: "impossible de créer le compte",
        }
    }

    redirect("/Auth/Login");

}

export async function login(state: AuthState, formdata: FormData): Promise<AuthState> {
    const validation = authSchema.safeParse({
        nickname: formdata.get("nickname"),
        password: formdata.get("password")
    });

    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
            message: "Le formulaire contient des erreurs"
        }
    }

    const { nickname, password } = validation.data;

    const existingUser = await Contact.findOne({
        where: { nickname },
        raw: true
    });

    if (!existingUser) {
        return {
            message: "Pseudo ou mot de passe incorrect"
        }
    }
    console.log("hash :");
    console.log(existingUser);
    const passwordIsValid = await argon2.verify(
        existingUser.password,
        password
    )

    if (!passwordIsValid) {
        return {
            message: "Pseudo ou mot de passe incorrect"
        }
    }

    await createSession({
        userId: existingUser.id,
        nickname: existingUser.nickname
    })

    redirect("/Dashboard");
}