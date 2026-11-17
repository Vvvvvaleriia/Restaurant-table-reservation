import ReviewRepository from "../repositories/review.js";
import ReservationRepository from "../repositories/reservation.js";
import { AppError } from "../errrors/AppError.js";

export default class ReviewService {
	static async create(userId, data) {
		const allowedFields = ["reservationId", "rating", "comment"];
		const invalidFields = Object.keys(data).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw new AppError.badRequest("Request contains invalid fields");
		}

		const { reservationId, rating, comment } = data;

		if (reservationId === undefined || rating === undefined) {
			throw new AppError.badRequest(
				"reservation ID and rating are required",
			);
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				reservationId,
			)
		) {
			throw new AppError.badRequest("Invalid reservation ID");
		}

		if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
			throw new AppError.badRequest(
				"Rating must be an integer between 1 and 5",
			);
		}

		if (
			comment !== undefined &&
			comment !== null &&
			(typeof comment !== "string" || !comment.trim())
		) {
			throw new AppError.badRequest("Comment must be a string");
		}

		const reservation = await ReservationRepository.findById(reservationId);

		if (!reservation) {
			throw new AppError.notFound("Reservation not found");
		}

		if (reservation.userId !== userId) {
			throw new AppError.forbidden("This is not your reservation");
		}

		if (reservation.status !== "completed") {
			throw new AppError.badRequest(
				"Review can only be created for completed reservations",
			);
		}

		const existingReview =
			await ReviewRepository.findByReservationId(reservationId);

		if (existingReview) {
			throw new AppError.conflict(
				"Review for this reservation already exists",
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
			throw new AppError.badRequest(
				"Limit must be 1-100 and page must be a positive integer",
			);
		}

		const offset = (parsedPage - 1) * parsedLimit;

		const { count, rows } = await ReviewRepository.findAll({
			limit: parsedLimit,
			offset,
		});

		return {
			data: rows,
			pagination: {
				totalItems: count,
				totalPages: Math.ceil(count / parsedLimit),
				currentPage: parsedPage,
				limit: parsedLimit,
			},
		};
	}

	static async getById(id) {
		const review = await ReviewRepository.findById(id);

		if (!review) {
			throw new AppError.notFound("Review not found");
		}

		return review;
	}

	static async update(userId, role, id, data) {
		const allowedFields = ["rating", "comment"];
		const fields = Object.keys(data);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			throw new AppError.badRequest("Invalid or empty request body");
		}

		const review = await ReviewRepository.findById(id);

		if (!review) {
			throw new AppError.notFound("Review not found");
		}

		if (review.userId !== userId && role !== "admin") {
			throw new AppError.forbidden("Access denied");
		}

		const { rating, comment } = data;

		if (
			rating !== undefined &&
			(!Number.isInteger(rating) || rating < 1 || rating > 5)
		) {
			throw new AppError.badRequest(
				"Rating must be an integer between 1 and 5",
			);
		}

		if (
			comment !== undefined &&
			comment !== null &&
			(typeof comment !== "string" || !comment.trim())
		) {
			throw new AppError.badRequest("Comment must be a string");
		}

		await ReviewRepository.update(review, {
			...(rating !== undefined && { rating }),
			...(comment !== undefined && {
				comment: comment === null ? null : comment.trim(),
			}),
		});

		return review;
	}

	static async delete(userId, role, id) {
		const review = await ReviewRepository.findById(id);

		if (!review) {
			throw new AppError.notFound("Review not found");
		}

		if (review.userId !== userId && role !== "admin") {
			throw new AppError.forbidden("Access denied");
		}

		return await ReviewRepository.delete(review);
	}
}
