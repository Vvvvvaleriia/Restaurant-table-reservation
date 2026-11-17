import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

export const Reservation = sequelize.define(
	"Reservation",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		reservationDatetime: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		guests: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isInt: true,
				min: 1,
				max: 50,
			},
		},
		status: {
			type: DataTypes.ENUM("active", "cancelled", "completed"),
			allowNull: false,
			defaultValue: "active",
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		tableId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		tableName: "reservations",
		paranoid: true,
		indexes: [
			{ fields: ["userId"] },
			{ fields: ["tableId", "reservationDatetime"] },
		],
	},
);
