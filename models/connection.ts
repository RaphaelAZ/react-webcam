import { Sequelize } from "sequelize-typescript";
import Contact from "./Contact";
import Conversation from "./Conversation";
import Message from "./Message";
import ConversationContact from "./ConversationContact";

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: "",
    database: 'react_webcam',
    models: [Contact,Conversation,Message,ConversationContact],
});

export function connectToDatabase() {
    return sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch((error) => {
            console.error('Unable to connect to the database:', error);
        });
}

export default sequelize;