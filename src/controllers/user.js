import UserService from "../services/user.js";

export default class UserController {
	static async getAll(req, resp) {
		try {
			const { limit = 10, page = "1" } = req.query;

			const users = await UserService.getAll(limit, page);

			return resp.status(200).json(users);
		} catch (error) {
			console.error(error);
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
			const user = await UserService.getById(
				req.user.id,
				req.user.role,
				req.params.id,
			);

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
			const user = await UserService.update(
				req.user.id,
				req.user.role,
				req.params.id,
				req.body,
			);

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
			await UserService.delete(req.user.id, req.user.role, req.params.id);

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
