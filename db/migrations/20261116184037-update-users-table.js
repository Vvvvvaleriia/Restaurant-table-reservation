"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn("users", "name", {
			type: Sequelize.STRING(50),
			allowNull: false,
		});

		await queryInterface.changeColumn("users", "email", {
			type: Sequelize.STRING(100),
			allowNull: false,
			unique: true,
		});

		await queryInterface.changeColumn("users", "phone", {
			type: Sequelize.STRING(16),
			allowNull: false,
		});

		await queryInterface.changeColumn("users", "password_hash", {
			type: Sequelize.STRING(60),
			allowNull: false,
		});

		await queryInterface.changeColumn("users", "refresh_token", {
			type: Sequelize.TEXT,
			allowNull: true,
			unique: false,
		});

		await queryInterface.addConstraint("users", {
			fields: ["name"],
			type: "check",
			where: Sequelize.literal("LENGTH(name) BETWEEN 2 AND 50"),
			name: "users_name_length_check",
		});

		await queryInterface.addConstraint("users", {
			fields: ["email"],
			type: "check",
			where: Sequelize.literal(
				"email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'",
			),
			name: "users_email_format_check",
		});

		await queryInterface.addConstraint("users", {
			fields: ["phone"],
			type: "check",
			where: Sequelize.literal("phone ~ '^\\+?[0-9]{7,15}$'"),
			name: "users_phone_format_check",
		});

		await queryInterface.addConstraint("users", {
			fields: ["password_hash"],
			type: "check",
			where: Sequelize.literal("LENGTH(password_hash) > 0"),
			name: "users_password_hash_length_check",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint(
			"users",
			"users_name_length_check",
		);
		await queryInterface.removeConstraint(
			"users",
			"users_email_format_check",
		);
		await queryInterface.removeConstraint(
			"users",
			"users_phone_format_check",
		);
		await queryInterface.removeConstraint(
			"users",
			"users_password_hash_length_check",
		);

		await queryInterface.changeColumn("users", "name", {
			type: Sequelize.STRING(100),
			allowNull: false,
		});

		await queryInterface.changeColumn("users", "email", {
			type: Sequelize.STRING(255),
			allowNull: false,
			unique: true,
		});

		await queryInterface.changeColumn("users", "phone", {
			type: Sequelize.STRING(20),
			allowNull: false,
		});

		await queryInterface.changeColumn("users", "refresh_token", {
			type: Sequelize.TEXT,
			allowNull: true,
			unique: true,
		});

		await queryInterface.changeColumn("users", "password_hash", {
			type: Sequelize.STRING(255),
			allowNull: false,
		});
	},
};
