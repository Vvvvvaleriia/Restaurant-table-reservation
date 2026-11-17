"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn("reviews", "comment", {
			type: Sequelize.STRING(500),
			allowNull: true,
		});

		await queryInterface.addConstraint("reviews", {
			fields: ["comment"],
			type: "check",
			where: Sequelize.literal("LENGTH(comment) <= 500"),
			name: "reviews_comment_length_check",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint(
			"reviews",
			"reviews_comment_length_check",
		);

		await queryInterface.changeColumn("reviews", "comment", {
			type: Sequelize.TEXT,
			allowNull: true,
		});
	},
};
