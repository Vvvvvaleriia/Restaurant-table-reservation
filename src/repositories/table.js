import { Table, TableType } from "../models/index.js";

export default class TableRepository {
	static async create(data) {
		return await Table.create(data);
	}

	static async findAll({ limit, offset }) {
		return await Table.findAndCountAll({
			where: {
				deletedAt: null,
			},
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: TableType,
					as: "tableType",
					attributes: ["name", "description", "markup"],
				},
			],
		});
	}

	static async findById(id) {
		return await Table.findOne({
			where: {
				id: id,
				deletedAt: null,
			},
			include: [
				{
					model: TableType,
					as: "tableType",
					attributes: ["name", "description", "markup"],
				},
			],
		});
	}

	static async findByNumber(tableNumber) {
		return await Table.findOne({
			where: {
				tableNumber: tableNumber,
				deletedAt: null,
			},
		});
	}

	static async update(table, data) {
		return await table.update(data);
	}

	static async delete(id, transaction) {
		const table = await Table.findByPk(id, { transaction });

		if (!table) {
			return null;
		}

		await table.destroy({ transaction });
		return table;
	}
}
