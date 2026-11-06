import ReviewRepository from "../repositories/review.js";
import UserRepository from "../repositories/user";

export default class ReviewService {
	static async create(data) {
		if (!data || typeof data !== "object" || Array.isArray(data)) {
			throw Object.assign(new Error("Request body must be an object"), {
				status: 400,
			});
		}

		const allowedFields = ["userId", "rating", "comment"];
		const invalidFields = Object.keys(req.body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw Object.assign(new Error("Request contains invalid fields"), {
				status: 400,
			});
		}

		const { userId, rating, comment } = data;

		if (userId === undefined || rating === undefined) {
			throw Object.assign(new Error("User ID and rating are required"), {
				status: 400,
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				userId,
			)
		) {
			throw Object.assign(new Error("Invalid user ID"), {
				status: 400,
			});
		}

		if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
			throw Object.assign(
				new Error("Rating must be an integer between 1 and 5"),
				{ status: 400 },
			);
		}

		if (
			comment !== undefined &&
			comment !== null &&
			(typeof comment !== "string" || !comment.trim())
		) {
			throw Object.assign(new Error("Comment must be a string"), {
				status: 400,
			});
		}

		const user = await UserRepository.findById(userId);

		if (!user) {
			throw Object.assign(new Error("User not found"), {
				status: 404,
			});
		}

		await ReviewRepository.create({
			userId,
			rating,
			comment: comment?.trim() || null,
		});
	}

	static async getAll(limit, page) {
		const parsedLimit = Number(limit);
		const parsedPage = Number(page);

		if (
			!Number.isInteger(parsedLimit) ||
			!Number.isInteger(parsedPage) ||
			parsedLimit < 1 ||
			parsedLimit > 100 ||
			parsedPage < 1
		) {
			throw Object.assign(
				new Error(
					"Limit must be 1-100 and page must be a positive integer",
				),
				{ status: 400 },
			);
		}

		const offset = (parsedPage - 1) * parsedLimit;

		return await TableRepository.findAll({
			parsedLimit,
			offset,
		});
	}

	static async getById(id) {
		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			return resp.status(400).json({
				message: "Invalid review ID",
			});
		}

		const review = await ReviewRepository.findById(id);

		if (!review) {
			return resp.status(404).json({
				message: "Review not found",
			});
		}

		return review;
	}

	static async update(id, data) {
		if (!data || typeof data !== "object" || Array.isArray(data)) {
			throw Object.assign(new Error("Request body must be an object"), {
				status: 400,
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			throw Object.assign(new Error("Invalid table ID"), {
				status: 400,
			});
		}

		const allowedFields = ["userId", "rating", "comment"];
		const fields = Object.keys(req.body);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			throw Object.assign(new Error("Invalid or empty request body"), {
				status: 400,
			});
		}

		const review = await ReviewRepository.findById(id);

		if (!review) {
			throw Object.assign(new Error("Review not found"), {
				status: 404,
			});
		}

		const { userId, rating, comment } = data;

		if (userId !== undefined) {
			if (
				typeof userId !== "string" ||
				!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
					userId,
				)
			) {
				throw Object.assign(new Error("Invalid user ID"), {
					status: 400,
				});
			}

			const user = await UserRepository.findById(userId);

			if (!user) {
				throw Object.assign(new Error("User not found"), {
					status: 404,
				});
			}
		}

		if (
			(rating !== undefined && !Number.isInteger(rating)) ||
			rating < 1 ||
			rating > 5
		) {
			throw Object.assign(
				new Error("Rating must be an integer between 1 and 5"),
				{ status: 400 },
			);
		}

		if (
			(comment !== undefined &&
				comment !== null &&
				typeof comment !== "string") ||
			comment.trim()
		) {
			throw Object.assign(new Error("Comment must be a string"), {
				status: 400,
			});
		}

		await ReviewRepository.update(review, {
			...(userId !== undefined && { userId }),
			...(rating !== undefined && { rating }),
			...(comment !== undefined && {
				comment: comment === null ? null : comment.trim(),
			}),
		});
	}

	static async delete(id) {
		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			throw Object.assign(new Error("Invalid review ID"), {
				status: 400,
			});
		}

		const review = await ReviewRepository.findById(id);

		if (!review) {
			throw Object.assign(new Error("Review not found"), {
				status: 404,
			});
		}

		return await ReviewRepository.delete(review);
	}
}
