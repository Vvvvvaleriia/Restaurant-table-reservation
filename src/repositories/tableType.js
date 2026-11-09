import { TableType } from "../models/tableType.js";

export default class TableTypeRepository {
	static async create(data) {
		return await TableType.create(data);
	}

	static async findAll({ limit, offset }) {
		return await TableType.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
		});
	}

	static async findById(id) {
		return await TableType.findByPk(id);
	}

	static async findByName(name) {
		return await TableType.findOne({
			where: { name },
		});
	}

	static async update(tableType, data) {
		return await tableType.update(data);
	}

	static async delete(tableType) {
		return await tableType.destroy();
	}
}
