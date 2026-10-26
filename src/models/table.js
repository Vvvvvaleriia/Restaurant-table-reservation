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
				min: 1,
			},
		},
		seats: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
			},
		},
		tableTypeId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		tableName: "tables",
	},
);
