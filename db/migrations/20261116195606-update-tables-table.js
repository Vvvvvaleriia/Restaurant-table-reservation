"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn("tables", "table_number", {
			type: Sequelize.INTEGER,
			allowNull: false,
		});

		await queryInterface.changeColumn("tables", "seats", {
			type: Sequelize.INTEGER,
			allowNull: false,
		});

		await queryInterface.addColumn("tables", "deleted_at", {
			type: Sequelize.DATE,
			allowNull: true,
		});

		await queryInterface.addConstraint("tables", {
			fields: ["table_number"],
			type: "check",
			where: Sequelize.literal("table_number BETWEEN 1 AND 9999"),
			name: "tables_table_number_range_check",
		});

		await queryInterface.addConstraint("tables", {
			fields: ["seats"],
			type: "check",
			where: Sequelize.literal("seats BETWEEN 1 AND 50"),
			name: "tables_seats_range_check",
		});

		await queryInterface.addIndex("tables", ["table_number"], {
			unique: true,
			where: {
				deleted_at: null,
			},
			name: "tables_table_number_active_unique",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex(
			"tables",
			"tables_table_number_active_unique",
		);

		await queryInterface.removeConstraint(
			"tables",
			"tables_table_number_range_check",
		);

		await queryInterface.removeConstraint(
			"tables",
			"tables_seats_range_check",
		);

		await queryInterface.removeColumn("tables", "deleted_at");
	},
};
