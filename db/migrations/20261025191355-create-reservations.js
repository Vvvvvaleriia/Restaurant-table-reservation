"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("reservations", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			reservation_datatime: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			quests: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM("active", "cancelled", "completed"),
				allowNull: false,
				defaultValue: "active",
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "users", key: "id" },
				onDelete: "CASCADE",
			},
			table_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "tables", key: "id" },
				onDelete: "RESTRICT",
			},
		});

		await queryInterface.addIndex("reservations", ["user_id"]);
		await queryInterface.addIndex("reservations", ["table_id"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("reservations");
	},
};
