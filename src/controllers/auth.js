import AuthService from "../services/auth.js";
import { StatusCodes } from "http-status-codes";

export default class AuthController {
	static async register(req, resp) {
		const user = await AuthService.register(req.body);

		return resp.status(StatusCodes.CREATED).json(user);
	}

	static async login(req, resp) {
		const tokens = await AuthService.login(req.body);

		return resp.status(StatusCodes.OK).json(tokens);
	}

	static async profile(req, resp) {
		const user = await AuthService.profile(req.user.id);

		return resp.status(StatusCodes.OK).json(user);
	}

	static async refresh(req, resp) {
		const tokens = await AuthService.refresh(req.body);

		return resp.status(StatusCodes.OK).json(tokens);
	}

	static async logout(req, resp) {
		const result = await AuthService.logout(req.body);

		return resp.status(StatusCodes.OK).json(result);
	}
}
