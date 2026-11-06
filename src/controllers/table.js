import TableService from "../services/table.js";

export default class TableController {
	static async create(req, resp) {
		try {
			const table = await TableService.create(req.body);

			return resp.status(201).json(table);
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
			const { limit = 10, page = "1" } = req.query;

			const tables = TableService.getAll(limit, page);

			return resp.status(200).json(tables);
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

			const table = await TableService.getById(id);

			return resp.status(201).json(table);
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

			const table = TableService.update(id, req.body);

			return resp.status(200).json(table);
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

			await TableService.delete(id);

			return resp.status(200).json({
				message: "Table delete successfuly",
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
