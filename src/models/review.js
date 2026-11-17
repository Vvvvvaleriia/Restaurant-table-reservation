import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Review = sequelize.define(
	"Review",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		rating: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
				max: 5,
			},
		},
		comment: {
			type: DataTypes.STRING(500),
			allowNull: true,
			validate: {
				len: [0, 500],
			},
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		reservationId: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
		},
	},
	{
		tableName: "reviews",
	},
);
