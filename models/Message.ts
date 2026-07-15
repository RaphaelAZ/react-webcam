import {  BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Conversation from "./Conversation";
import Contact from "./Contact";

@Table({
    tableName: 'messages',
    timestamps: true,
})
export default class Message extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    content!: string;

    @ForeignKey(() => Conversation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    conversationId!: number;

    @ForeignKey(() => Contact)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    contactId!: number;
    
    @BelongsTo(() => Conversation)
    conversation!: Conversation;

    @BelongsTo(() => Contact)
    contact!: Contact;  
}