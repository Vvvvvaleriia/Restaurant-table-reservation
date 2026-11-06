import UserService from "../services/user.js";

export default class UserController {
	static async getAll() {
		try {
			const { limit = 10, page = "1" } = req.query;

			const users = UserService.getAll(limit, page);

			return resp.status(200).json(users);
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

			const user = UserService.getById(id);

			return resp.status(200).json(user);
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

			const user = UserService.update(id, req.body);

			return resp.status(200).json(user);
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

			await UserService.delete(id);

			return resp.status(200).json({
				message: "User delete successfuly",
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
