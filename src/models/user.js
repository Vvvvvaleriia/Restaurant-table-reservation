import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			validate: {
				notEmpty: true,
			},
		},
		name: {
			type: DataTypes.STRING(100),
			validate: {
				notEmpty: true,
			},
		},
		email: {
			type: DataTypes.STRING(255),
			unique: true,
			validate: {
				notEmpty: true,
			},
		},
		phone: {
			type: DataTypes.STRING(20),
			validate: {
				notEmpty: true,
			},
		},
		password_hash: {
			type: DataTypes.STRING(255),
			validate: {
				notEmpty: true,
			},
		},
	},
	{
		tableName: "users",
	},
);
