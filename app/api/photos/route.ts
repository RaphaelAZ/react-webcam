import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

function extractBase64Image(dataUrl: string): Buffer {
    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);

    if (!match) {
        throw new Error("Format d'image invalide.");
    }

    return Buffer.from(match[2], "base64");
}

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const image = typeof body === "object" && body !== null && "image" in body ? (body as { image?: unknown }).image : null;

        if (typeof image !== "string" || !image) {
            return Response.json({ error: "Aucune image reçue." }, { status: 400 });
        }

        const buffer = extractBase64Image(image);
        const uploadsDirectory = path.join(process.cwd(), "uploads", "photos");
        await mkdir(uploadsDirectory, { recursive: true });

        const fileName = `photo-${Date.now()}.png`;
        const filePath = path.join(uploadsDirectory, fileName);

        await writeFile(filePath, buffer);

        return Response.json({ message: "Photo sauvegardée.", fileName });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Impossible de sauvegarder la photo.";
        return Response.json({ error: message }, { status: 500 });
    }
}
