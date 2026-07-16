import Contact from "@/models/Contact";
import {connectToDatabase} from "@/models/connection";

connectToDatabase();
export default async function ContactPage() {
    const contacts = await Contact.findAll({raw: true});

    return (
        <div>
            <h1>Contact Page</h1>
            <p>This is the contact page.</p>
            {contacts.map((contact) => (
                <div key={"contact" + contact.id}>
                    <h2>{contact.nickname}</h2>
                </div>
            ))}
        </div>
    );
}