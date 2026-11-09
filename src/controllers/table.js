import TableService from "../services/table.js";
import { StatusCodes } from "http-status-codes";

export default class TableController {
	static async create(req, resp) {
		try {
			const table = await TableService.create(req.body);

			return resp.status(StatusCodes.CREATED).json(table);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}

	static async getAll(req, resp) {
		try {
			const { limit = 10, page = "1" } = req.query;

			const tables = await TableService.getAll(limit, page);

			return resp.status(StatusCodes.OK).json(tables);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}

	static async getById(req, resp) {
		try {
			const { id } = req.params;

			const table = await TableService.getById(id);

			return resp.status(StatusCodes.CREATED).json(table);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}

	static async update(req, resp) {
		try {
			const { id } = req.params;

			const table = await TableService.update(id, req.body);

			return resp.status(StatusCodes.OK).json(table);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}

	static async delete(req, resp) {
		try {
			const { id } = req.params;

			await TableService.delete(id);

			return resp.status(StatusCodes.OK).json({
				message: "Table delete successfuly",
			});
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}
}
