"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addConstraint("reviews", {
			fields: ["reservation_id"],
			type: "unique",
			name: "reviews_reservation_id_unique",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint(
			"reviews",
			"reviews_reservation_id_unique",
		);
	},
};
