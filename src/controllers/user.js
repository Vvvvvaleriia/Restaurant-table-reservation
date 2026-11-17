import UserService from "../services/user.js";
import { StatusCodes } from "http-status-codes";

export default class UserController {
	static async getAll(req, resp) {
		const { limit = 10, page = "1" } = req.query;

		const users = await UserService.getAll(limit, page);

		return resp.status(StatusCodes.OK).json(users);
	}

	static async getById(req, resp) {
		const user = await UserService.getById(
			req.user.id,
			req.user.role,
			req.params.id,
		);

		return resp.status(StatusCodes.OK).json(user);
	}

	static async update(req, resp) {
		const user = await UserService.update(
			req.user.id,
			req.user.role,
			req.params.id,
			req.body,
		);

		return resp.status(StatusCodes.OK).json(user);
	}

	static async delete(req, resp) {
		await UserService.delete(req.user.id, req.user.role, req.params.id);

		return resp.status(StatusCodes.OK).json({
			message: "User delete successfuly",
		});
	}
}
