import { Review } from "../models.js";
import { Reservation } from "../models/reservation.js";

export default class ReviewRepository {
	static async create(data) {
		return await Review.create(data);
	}

	static async findAll(limit, offset) {
		return await Review.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
		});
	}

	static async findById(id) {
		return await Review.findByPk(id);
	}

	static async findByReservationId(reservationId) {
		return await Review.findOne({
			where: {
				reservationId,
			},
		});
	}

	static async update(review, data) {
		return await review.update(data);
	}

	static async delete(review) {
		return await review.destroy();
	}
}
