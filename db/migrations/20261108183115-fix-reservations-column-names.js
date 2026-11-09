"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameColumn(
			"reservations",
			"reservation_datatime",
			"reservation_datetime",
		);

		await queryInterface.renameColumn("reservations", "quests", "guests");
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameColumn(
			"reservations",
			"reservation_datetime",
			"reservation_datatime",
		);

		await queryInterface.renameColumn("reservations", "guests", "quests");
	},
};
