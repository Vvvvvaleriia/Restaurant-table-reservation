"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("users", [
			{
				id: "550e8400-e29b-41d4-a716-446655440001",
				name: "Ivan Petrenko",
				email: "ivan@example.com",
				phone: "+380501111111",
				password_hash: "$2b$12$exampleHash1",
			},
			{
				id: "550e8400-e29b-41d4-a716-446655440002",
				name: "Olena Kovalenko",
				email: "olena@example.com",
				phone: "+380502222222",
				password_hash: "$2b$12$exampleHash2",
			},
			{
				id: "550e8400-e29b-41d4-a716-446655440003",
				name: "Andrii Shevchenko",
				email: "andrii@example.com",
				phone: "+380503333333",
				password_hash: "$2b$12$exampleHash3",
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("users", null, {});
	},
};
