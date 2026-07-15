import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Contact from "./Contact";
import ConversationContact from "./ConversationContact";

@Table({
    tableName: 'conversations',
    timestamps: true,
})
export default class Conversation extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @BelongsToMany(
        () => Contact,
        () => ConversationContact
    )
    conversationContacts!: Contact[];
}