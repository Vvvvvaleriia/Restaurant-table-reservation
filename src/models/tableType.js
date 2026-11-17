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
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true,
				len: [2, 50],
			},
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: true,
			validate: {
				len: [0, 500],
			},
		},
		markup: {
			type: DataTypes.DECIMAL(8, 2),
			allowNull: false,
			defaultValue: 0,
			validate: {
				isDecimal: true,
				min: 0,
				max: 100000,
			},
		},
	},
	{
		tableName: "table_types",
	},
);
