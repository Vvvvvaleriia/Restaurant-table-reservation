import TableTypeService from "../services/tableType.js";

export default class TableTypeController {
	static async create(req, resp) {
		try {
			const tableType = await TableTypeService.create(req.body);

			return resp.status(201).json(tableType);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
				message: "Internal server error",
			});
		}
	}

	static async getAll(req, resp) {
		try {
			const { limit = 3, page = "1" } = req.query;

			const tableTypes = TableTypeService.getAll(limit, page);

			return resp.status(200).json(tableTypes);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
				message: "Internal server error",
			});
		}
	}

	static async getById(req, resp) {
		try {
			const { id } = req.params;

			const tableType = TableTypeService.getById(id);

			return resp.status(200).json(tableType);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
				message: "Internal server error",
			});
		}
	}

	static async update(req, resp) {
		try {
			const { id } = req.params;

			const tableType = TableTypeService.update(id, req.body);

			return resp.status(200).json(tableType);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
				message: "Internal server error",
			});
		}
	}

	static async delete(req, resp) {
		try {
			const { id } = req.params;

			await TableTypeService.delete(id);

			return resp.status(200).json({
				message: "Table type delete successfuly",
			});
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
				message: "Internal server error",
			});
		}
	}
}
