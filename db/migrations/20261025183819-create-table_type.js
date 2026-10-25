"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("table_types", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING(10),
				allowNull: false,
				unique: true,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			markup: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
				defaultValue: 0,
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
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("table_types");
	},
};
