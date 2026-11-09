import { Reservation } from "../models/reservation.js";

export default class ReservationRepository {
	static async create(data) {
		return await Reservation.create(data);
	}

	static async findAll({ limit, offset }) {
		return await Reservation.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
		});
	}

	static async findById(id) {
		return await Reservation.findByPk(id);
	}

	static async update(reservation, data) {
		return await reservation.update(data);
	}

	static async delete(reservation) {
		return await reservation.destroy();
	}
}
