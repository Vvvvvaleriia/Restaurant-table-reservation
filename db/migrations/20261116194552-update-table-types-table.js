"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn("table_types", "name", {
			type: Sequelize.STRING(50),
			allowNull: false,
		});

		await queryInterface.changeColumn("table_types", "description", {
			type: Sequelize.STRING(500),
			allowNull: true,
		});

		await queryInterface.changeColumn("table_types", "markup", {
			type: Sequelize.DECIMAL(8, 2),
			allowNull: false,
			defaultValue: 0,
		});

		await queryInterface.addConstraint("table_types", {
			fields: ["name"],
			type: "check",
			where: Sequelize.literal("LENGTH(name) BETWEEN 2 AND 50"),
			name: "table_types_name_length_check",
		});

		await queryInterface.addConstraint("table_types", {
			fields: ["description"],
			type: "check",
			where: Sequelize.literal("LENGTH(description) <= 500"),
			name: "table_types_description_length_check",
		});

		await queryInterface.addConstraint("table_types", {
			fields: ["markup"],
			type: "check",
			where: Sequelize.literal("markup >= 0 AND markup <= 100000"),
			name: "table_types_markup_range_check",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint(
			"table_types",
			"table_types_name_length_check",
		);

		await queryInterface.removeConstraint(
			"table_types",
			"table_types_description_length_check",
		);

		await queryInterface.removeConstraint(
			"table_types",
			"table_types_markup_range_check",
		);

		await queryInterface.changeColumn("table_types", "name", {
			type: Sequelize.STRING(10),
			allowNull: false,
			unique: true,
		});

		await queryInterface.changeColumn("table_types", "description", {
			type: Sequelize.TEXT,
			allowNull: true,
		});

		await queryInterface.changeColumn("table_types", "markup", {
			type: Sequelize.DECIMAL(10, 2),
			allowNull: false,
			defaultValue: 0,
		});
	},
};
