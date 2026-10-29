"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("reviews", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			rating: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			comment: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "users", key: "id" },
				onDelete: "CASCADE",
			},
			reservation_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "reservations", key: "id" },
				onDelete: "RESTRICT",
			},
		});

		await queryInterface.addConstraint("reviews", {
			fields: ["rating"],
			type: "check",
			where: Sequelize.literal("rating BETWEEN 1 AND 5"),
			name: "reviews_rating_check",
		});

		await queryInterface.addIndex("reviews", ["user_id"]);
		await queryInterface.addIndex("reviews", ["reservation_id"], {
			unique: true,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("reviews");
	},
};
