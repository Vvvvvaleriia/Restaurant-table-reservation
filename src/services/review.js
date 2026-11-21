import ReviewRepository from "../repositories/review.js";
import { AppError } from "../errors/AppError.js";
import { paginatedResponse, parsePagination } from "../utils/pagination.js";
import {
	checkAllowedFields,
	checkNumber,
	checkUuid,
	checkNullableString,
} from "../utils/validation.js";
import {
	reservationExists,
	reviewAllreadyExists,
	reviewExists,
} from "../utils/exists.js";
import checkOwnerOrAdmin from "../utils/access.js";

export default class ReviewService {
	static async create(userId, data) {
		const allowedFields = ["reservationId", "rating", "comment"];
		checkAllowedFields(allowedFields, data);

		const { reservationId, rating, comment } = data;

		if (reservationId === undefined || rating === undefined) {
			throw AppError.badRequest("reservation ID and rating are required");
		}

		checkUuid(reservationId, "reservation");
		checkNumber(rating, "Rating must be an integer between 1 and 5", {
			max: 5,
		});
		checkNullableString(comment, "Comment must be a string");

		const reservation = await reservationExists(reservationId);

		if (reservation.userId !== userId) {
			throw AppError.forbidden("This is not your reservation");
		}

		if (reservation.status !== "completed") {
			throw AppError.badRequest(
				"Review can only be created for completed reservations",
			);
		}

		await reviewAllreadyExists(reservationId);

		return await ReviewRepository.create({
			userId,
			reservationId,
			rating,
			comment: comment?.trim() ?? null,
		});
	}

	static async getAll(limit, page) {
		const parsedLimit = Number(limit);
		const parsedPage = Number(page);

		const { offset } = parsePagination(parsedLimit, parsedPage);

		const { count, rows } = await ReviewRepository.findAll({
			limit: parsedLimit,
			offset,
		});

		return paginatedResponse(count, rows, parsedLimit, parsedPage);
	}

	static async getById(id) {
		return await reviewExists(id);
	}

	static async update(userId, role, id, data) {
		const allowedFields = ["rating", "comment"];
		checkAllowedFields(allowedFields, data);

		const review = await reviewExists(id);
		checkOwnerOrAdmin(review.userId, userId, role);

		const { rating, comment } = data;
		const changes = {};

		if (rating !== undefined) {
			checkNumber(rating, "Rating must be an integer between 1 and 5", {
				max: 5,
			});
			changes.rating = rating;
		}

		if (comment !== undefined) {
			checkNullableString(comment, "Comment must be a string");
			changes.comment = comment?.trim() ?? null;
		}

		await ReviewRepository.update(review, changes);

		return review;
	}

	static async delete(userId, role, id) {
		const review = await reviewExists(id);

		checkOwnerOrAdmin(review.userId, userId, role);

		return await ReviewRepository.delete(review);
	}
}
