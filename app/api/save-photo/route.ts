import { promises } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import sequelize,{connectToDatabase} from "./../../../models/connection";

await connectToDatabase();

export async function POST(request: Request){
    const formData = await request.formData();
    const photo = formData.get("photo") as Blob | null;

    if(!photo || !(photo instanceof Blob)){
        return new Response("Invalid photo data", { status: 400 });
    }

    const byts = await photo.arrayBuffer();
    const buffer = Buffer.from(byts);

    const uploadDirectory = path.join(process.cwd(), "public","uploads");

    await mkdir(uploadDirectory, { recursive: true });

    const filename = `${Date.now()}.png`;

    await promises.writeFile(path.join(uploadDirectory, filename), buffer);

    return new Response(JSON.stringify({ message: "Photo saved successfully", filename }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}