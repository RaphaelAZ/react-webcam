// models/ConversationContact.ts

import {
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import Conversation from "./Conversation";
import Contact from "./Contact";

@Table({
  tableName: "conversation_contacts",
  timestamps: true,
})
export default class ConversationContact extends Model {
  @ForeignKey(() => Conversation)
  @Column
  declare conversationId: number;

  @ForeignKey(() => Contact)
  @Column
  declare contactId: number;
}