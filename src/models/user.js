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
			type: DataTypes.STRING(50),
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [2, 50],
			},
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true,
				isEmail: true,
				len: [3, 100],
			},
		},
		phone: {
			type: DataTypes.STRING(16),
			allowNull: false,
			validate: {
				notEmpty: true,
				is: /^\+?[0-9]{7,15}$/,
			},
		},
		passwordHash: {
			type: DataTypes.STRING(60),
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		refreshToken: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		role: {
			type: DataTypes.ENUM("user", "admin"),
			allowNull: false,
			defaultValue: "user",
		},
	},
	{
		tableName: "users",
		paranoid: true,
	},
);
