import ReviewService from "../services/review.js";
import { StatusCodes } from "http-status-codes";

export default class ReviewController {
	static async create(req, resp) {
		const review = await ReviewService.create(req.user.id, req.body);

		return resp.status(StatusCodes.CREATED).json(review);
	}

	static async getAll(req, resp) {
		const { limit = 10, page = "1" } = req.query;

		const reviews = await ReviewService.getAll(limit, page);

		return resp.status(StatusCodes.OK).json(reviews);
	}

	static async getById(req, resp) {
		const { id } = req.params;

		const review = await ReviewService.getById(id);

		return resp.status(StatusCodes.OK).json(review);
	}

	static async update(req, resp) {
		const review = await ReviewService.update(
			req.user.id,
			req.user.role,
			req.params.id,
			req.body,
		);

		return resp.status(StatusCodes.OK).json(review);
	}

	static async delete(req, resp) {
		await ReviewService.delete(req.user.id, req.user.role, req.params.id);

		return resp.status(StatusCodes.OK).json({
			message: "Review deleted successfuly",
		});
	}
}
