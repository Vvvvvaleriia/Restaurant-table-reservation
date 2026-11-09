import TableTypeService from "../services/tableType.js";
import { StatusCodes } from "http-status-codes";

export default class TableTypeController {
	static async create(req, resp) {
		try {
			const tableType = await TableTypeService.create(req.body);

			return resp.status(StatusCodes.CREATED).json(tableType);
		} catch (error) {
			console.error(error);
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
			const { limit = 3, page = "1" } = req.query;

			const tableTypes = await TableTypeService.getAll(limit, page);

			return resp.status(StatusCodes.OK).json(tableTypes);
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

			const tableType = await TableTypeService.getById(id);

			return resp.status(StatusCodes.OK).json(tableType);
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
		console.log("UPDATE TABLE TYPE CALLED");
		try {
			const { id } = req.params;

			const tableType = await TableTypeService.update(id, req.body);

			return resp.status(StatusCodes.OK).json(tableType);
		} catch (error) {
			if (error.status) {
				console.error(error);
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

			await TableTypeService.delete(id);

			return resp.status(StatusCodes.OK).json({
				message: "Table type delete successfuly",
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
