import TableTypeService from "../services/tableType.js";
import { StatusCodes } from "http-status-codes";

export default class TableTypeController {
	static async create(req, resp) {
		const tableType = await TableTypeService.create(req.body);

		return resp.status(StatusCodes.CREATED).json(tableType);
	}

	static async getAll(req, resp) {
		const { limit = 3, page = "1" } = req.query;

		const tableTypes = await TableTypeService.getAll(limit, page);

		return resp.status(StatusCodes.OK).json(tableTypes);
	}

	static async getById(req, resp) {
		const { id } = req.params;

		const tableType = await TableTypeService.getById(id);

		return resp.status(StatusCodes.OK).json(tableType);
	}

	static async update(req, resp) {
		const { id } = req.params;

		const tableType = await TableTypeService.update(id, req.body);

		return resp.status(StatusCodes.OK).json(tableType);
	}

	static async delete(req, resp) {
		const { id } = req.params;

		await TableTypeService.delete(id);

		return resp.status(StatusCodes.OK).json({
			message: "Table type deleted successfuly",
		});
	}
}
