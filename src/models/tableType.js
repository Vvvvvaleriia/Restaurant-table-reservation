import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const TableType = sequelize.define(
	"TableType",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(10),
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true,
			},
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		markup: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
			},
		},
	},
	{
		tableName: "table_types",
	},
);
