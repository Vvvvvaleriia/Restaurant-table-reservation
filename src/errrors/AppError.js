import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
	constructor(status, message) {
		super(message);
		this.name = "AppError";
		this.status = status;
	}

	static badRequest(message) {
		return new AppError(StatusCodes.BAD_REQUEST, message);
	}

	static unauthorized(message = "Unauthorized") {
		return new AppError(StatusCodes.UNAUTHORIZED, message);
	}

	static forbidden(message = "Access denied") {
		return new AppError(StatusCodes.FORBIDDEN, message);
	}

	static notFound(message = "Not found") {
		return new AppError(StatusCodes.NOT_FOUND, message);
	}

	static conflict(message) {
		return new AppError(StatusCodes.CONFLICT, message);
	}
}
