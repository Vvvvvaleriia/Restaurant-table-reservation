"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addConstraint("reservations", {
			fields: ["guests"],
			type: "check",
			where: Sequelize.literal("guests > 0"),
			name: "check_reservations_guests",
		});

		await queryInterface.addConstraint("tables", {
			fields: ["seats"],
			type: "check",
			where: Sequelize.literal("seats > 0"),
			name: "check_tables_seats",
		});

		await queryInterface.addConstraint("tables", {
			fields: ["table_number"],
			type: "check",
			where: Sequelize.literal("table_number > 0"),
			name: "check_tables_table_number",
		});

		await queryInterface.addConstraint("table_types", {
			fields: ["markup"],
			type: "check",
			where: Sequelize.literal("markup >= 0"),
			name: "check_table_types_markup",
		});

		await queryInterface.addConstraint("users", {
			fields: ["name"],
			type: "check",
			where: Sequelize.literal("LENGTH(TRIM(name)) > 0"),
			name: "users_name_check",
		});

		await queryInterface.addConstraint("users", {
			fields: ["email"],
			type: "check",
			where: Sequelize.literal("LENGTH(TRIM(email)) > 0"),
			name: "users_email_check",
		});

		await queryInterface.addConstraint("users", {
			fields: ["phone"],
			type: "check",
			where: Sequelize.literal("LENGTH(TRIM(phone)) > 0"),
			name: "users_phone_check",
		});

		await queryInterface.addConstraint("users", {
			fields: ["password_hash"],
			type: "check",
			where: Sequelize.literal("LENGTH(TRIM(password_hash)) > 0"),
			name: "users_password_hash_check",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint(
			"reservations",
			"check_reservations_guests",
		);

		await queryInterface.removeConstraint("tables", "check_tables_seats");
		await queryInterface.removeConstraint(
			"tables",
			"check_tables_table_number",
		);

		await queryInterface.removeConstraint(
			"table_types",
			"check_table_types_markup",
		);

		await queryInterface.removeConstraint("users", "users_name_check");
		await queryInterface.removeConstraint("users", "users_email_check");
		await queryInterface.removeConstraint("users", "users_phone_check");
		await queryInterface.removeConstraint(
			"users",
			"users_password_hash_check",
		);
	},
};
