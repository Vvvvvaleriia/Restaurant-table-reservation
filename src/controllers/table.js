import TableService from "../services/table.js";
import { StatusCodes } from "http-status-codes";

export default class TableController {
	static async create(req, resp) {
		const table = await TableService.create(req.body);

		return resp.status(StatusCodes.CREATED).json(table);
	}

	static async getAll(req, resp) {
		const { limit = 10, page = "1" } = req.query;

		const tables = await TableService.getAll(limit, page);

		return resp.status(StatusCodes.OK).json(tables);
	}

	static async getById(req, resp) {
		const { id } = req.params;

		const table = await TableService.getById(id);

		return resp.status(StatusCodes.OK).json(table);
	}

	static async update(req, resp) {
		const { id } = req.params;

		const table = await TableService.update(id, req.body);

		return resp.status(StatusCodes.OK).json(table);
	}

	static async delete(req, resp) {
		const { id } = req.params;

		await TableService.delete(id);

		return resp.status(StatusCodes.OK).json({
			message: "Table deleted successfuly",
		});
	}
}
