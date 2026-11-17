import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Table = sequelize.define(
	"Table",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		tableNumber: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
			validate: {
				isInt: true,
				min: 1,
				max: 9999,
			},
		},
		seats: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isInt: true,
				min: 1,
				max: 50,
			},
		},
		tableTypeId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		tableName: "tables",
		paranoid: true,
		indexes: [
			{
				unique: true,
				fields: ["tableNumber"],
				where: { deletedAt: null },
			},
		],
	},
);
