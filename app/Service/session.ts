import jwt from "jsonwebtoken";
import {cookies} from "next/headers";

const authKey = process.env.AUTH_KEY;

if(!authKey){
    throw new Error("La clé de signature est absente");
}

type SessionPayload = {
    userId: number;
    nickname: string;
}

export async function createSession(payload: SessionPayload){
    const token = await jwt.sign(payload,jwtKey);

    const cookieStore = await cookies();

    cookieStore.set("session",token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60*60*24
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if(!token){
        return null;
    }

    try{
        const payload = await jwt.verify(token, jwtKey);

        if (typeof payload === "string") {
            return null;
        }

        return {
            userId: Number(payload.userId),
            nickname: String(payload.nickname)
        }
    }catch{
        return null;
    }
}

const jwtKey: string = authKey;
