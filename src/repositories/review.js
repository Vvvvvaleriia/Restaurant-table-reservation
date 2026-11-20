import { Review, User } from "../models/index.js";

const includeToReview = [
	{
		model: User,
		as: "user",
		attributes: ["name"],
	},
];

export default class ReviewRepository {
	static async create(data) {
		return await Review.create(data);
	}

	static async findAll({ limit, offset }) {
		return await Review.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
			include: includeToReview,
		});
	}

	static async findById(id) {
		return await Review.findByPk(id, {
			include: includeToReview,
		});
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

	static async deleteByUserId(userId, transaction) {
		return await Review.destroy({ where: { userId }, transaction });
	}

	static async deleteByReservationId(reservationId, transaction) {
		return await Review.destroy({ where: { reservationId }, transaction });
	}

	static async delete(review) {
		return await review.destroy();
	}
}
