import { AllowNull, Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'contacts',
    timestamps: true,
})
export default class Contact extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    nickname!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;
}