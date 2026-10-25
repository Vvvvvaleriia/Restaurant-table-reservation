"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("tables", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			table_number: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true,
			},
			seats: {
				type: Sequelize.INTEGER,
				allowNull: false,
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
			table_type_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "table_types", key: "id" },
				onDelete: "RESTRICT",
			},
		});

		await queryInterface.addIndex("tables", ["table_types_id"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("tables");
	},
};
