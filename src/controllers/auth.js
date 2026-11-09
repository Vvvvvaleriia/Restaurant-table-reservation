import AuthService from "../services/auth.js";
import { StatusCodes } from "http-status-codes";

export default class AuthController {
	static async register(req, resp) {
		try {
			const user = await AuthService.register(req.body);

			return resp.status(StatusCodes.CREATED).json(user);
		} catch (error) {
			if (error.name === "SequelizeUniqueConstraintError") {
				return resp.status(StatusCodes.CONFLICT).json({
					error: "Email already exists",
				});
			}

			return resp
				.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: error.message,
				});
		}
	}

	static async login(req, resp) {
		try {
			const tokens = await AuthService.login(req.body);

			return resp.status(StatusCodes.OK).json(tokens);
		} catch (error) {
			return resp
				.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: error.message,
				});
		}
	}

	static async profile(req, resp) {
		try {
			const user = await AuthService.profile(req.user.id);

			return resp.status(StatusCodes.OK).json(user);
		} catch (error) {
			return resp
				.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: error.message,
				});
		}
	}

	static async refresh(req, resp) {
		try {
			const tokens = await AuthService.refresh(req.body);

			return resp.status(StatusCodes.OK).json(tokens);
		} catch (error) {
			return resp
				.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: error.message,
				});
		}
	}

	static async logout(req, resp) {
		try {
			const result = await AuthService.logout(req.body);

			return resp.status(StatusCodes.OK).json(result);
		} catch (error) {
			return resp
				.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: error.message,
				});
		}
	}
}
