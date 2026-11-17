"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeConstraint(
			"reservations",
			"reservations_user_id_fkey",
		);

		await queryInterface.addConstraint("reservations", {
			fields: ["user_id"],
			type: "foreign key",
			name: "reservation_user_id_fkey",
			references: {
				table: "users",
				field: "id",
			},
			onDelete: "RESTRICT",
			onUpdate: "CASCADE",
		});

		await queryInterface.removeConstraint(
			"reviews",
			"reviews_reservation_id_fkey",
		);

		await queryInterface.addConstraint("reviews", {
			fields: ["reservation_id"],
			type: "foreign key",
			name: "reviews_reservation_id_fkey",
			references: {
				table: "reservations",
				field: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint(
			"reservations",
			"reservations_user_id_fkey",
		);

		await queryInterface.addConstraint("reservations", {
			fields: ["user_id"],
			type: "foreign key",
			name: "reservation_user_id_fkey",
			references: {
				table: "users",
				field: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});

		await queryInterface.removeConstraint(
			"reviews",
			"reviews_reservation_id_fkey",
		);

		await queryInterface.addConstraint("reviews", {
			fields: ["reservation_id"],
			type: "foreign key",
			name: "reviews_reservation_id_fkey",
			references: {
				table: "reservations",
				field: "id",
			},
			onDelete: "RESTRICT",
			onUpdate: "CASCADE",
		});
	},
};
