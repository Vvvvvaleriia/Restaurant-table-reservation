import { Table } from "../models/table.js";

export default class TableRepository {
	static async create(data) {
		return await Table.create(data);
	}

	static async findAll({ limit, offset }) {
		return await Table.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
		});
	}

	static async findById(id) {
		return await Table.findByPk(id);
	}

	static async findByNumber(tableNumber) {
		return await Table.findOne({
			where: { tableNumber },
		});
	}

	static async update(table, data) {
		return await table.update(data);
	}

	static async delete(table) {
		return await table.destroy();
	}
}
