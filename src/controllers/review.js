import ReviewService from "../services/review.js";
import { StatusCodes } from "http-status-codes";

export default class ReviewController {
	static async create(req, resp) {
		try {
			const review = await ReviewService.create(req.user.id, req.body);

			return resp.status(StatusCodes.CREATED).json(review);
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

			const reviews = await ReviewService.getAll(limit, page);

			return resp.status(StatusCodes.OK).json(reviews);
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

			const review = await ReviewService.getById(id);

			return resp.status(StatusCodes.OK).json(review);
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
			const review = await ReviewService.update(
				req.user.id,
				req.user.role,
				req.params.id,
				req.body,
			);

			return resp.status(StatusCodes.OK).json(review);
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
			await ReviewService.delete(
				req.user.id,
				req.user.role,
				req.params.id,
			);

			return resp.status(StatusCodes.OK).json({
				message: "Review deleted successfuly",
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
