"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("reservations", "deleted_at", {
			type: Sequelize.DATE,
			allowNull: true,
		});

		await queryInterface.addConstraint("reservations", {
			fields: ["guests"],
			type: "check",
			where: Sequelize.literal("guests BETWEEN 1 AND 50"),
			name: "reservations_guests_range_check",
		});

		await queryInterface.addIndex(
			"reservations",
			["table_id", "reservation_datetime"],
			{
				name: "reservations_table_datetime_index",
			},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex(
			"reservations",
			"reservations_table_datetime_index",
		);

		await queryInterface.removeConstraint(
			"reservations",
			"reservations_guests_range_check",
		);

		await queryInterface.removeColumn("reservations", "deleted_at");
	},
};
