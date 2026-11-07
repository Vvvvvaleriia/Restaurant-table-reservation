import ReviewRepository from "../repositories/review.js";
import UserRepository from "../repositories/user";

export default class ReviewService {
	static async create(userId, data) {
		const allowedFields = ["reservationId", "rating", "comment"];
		const invalidFields = Object.keys(data).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw Object.assign(new Error("Request contains invalid fields"), {
				status: 400,
			});
		}

		const { reservationId, rating, comment } = data;

		if (reservationId === undefined || rating === undefined) {
			throw Object.assign(
				new Error("reservation ID and rating are required"),
				{
					status: 400,
				},
			);
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				reservationId,
			)
		) {
			throw Object.assign(new Error("Invalid reservation ID"), {
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

		const reservation = await ReservationRepository.findById(reservationId);

		if (!reservation) {
			throw Object.assign(new Error("Reservation not found"), {
				status: 404,
			});
		}

		if (reservation.userId !== userId) {
			throw Object.assign(new Error("This is not your reservation"), {
				status: 403,
			});
		}

		if (reservation.status !== "completed") {
			throw Object.assign(
				new Error(
					"Review can only be created for completed reservations",
				),
				{ status: 400 },
			);
		}

		const existingReview =
			await ReviewRepository.findByReservationId(reservationId);

		if (existingReview) {
			throw Object.assign(
				new Error("Review for this reservation already exists"),
				{ status: 409 },
			);
		}

		return await ReviewRepository.create({
			userId,
			reservationId,
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

		return await ReviewRepository.findAll({
			limit: parsedLimit,
			offset,
		});
	}

	static async getById(id) {
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

		return review;
	}

	static async update(userId, id, data) {
		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			throw Object.assign(new Error("Invalid review ID"), {
				status: 400,
			});
		}

		const allowedFields = ["rating", "comment"];
		const fields = Object.keys(data);

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

		if (review.userId !== userId) {
			throw Object.assign(new Error("This is not your review"), {
				status: 403,
			});
		}

		const { rating, comment } = data;

		if (
			rating !== undefined &&
			(!Number.isInteger(rating) || rating < 1 || rating > 5)
		) {
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

		await ReviewRepository.update(review, {
			...(rating !== undefined && { rating }),
			...(comment !== undefined && {
				comment: comment === null ? null : comment.trim(),
			}),
		});

		return review;
	}

	static async delete(userId, id) {
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

		if (review.userId !== userId) {
			throw Object.assign(new Error("This is not your review"), {
				status: 403,
			});
		}

		return await ReviewRepository.delete(review);
	}
}
