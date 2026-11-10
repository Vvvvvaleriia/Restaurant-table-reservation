"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn("users", "refresh_token", {
			type: Sequelize.TEXT,
			allowNull: true,
			unique: true,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn("users", "refresh_token", {
			type: Sequelize.TEXT,
			allowNull: true,
			unique: false,
		});
	},
};
