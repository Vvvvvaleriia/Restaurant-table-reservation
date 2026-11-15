import { Reservation, Table, TableType, User } from "../models/index.js";

const includeToReservation = [
				{
					model: User,
					as: "user",
					attributes: ["name", "email"],
				},
				{
					model: Table,
					as: "table",
					attributes: ["tableNumber", "seats"],
					include: [
						{
							model: TableType,
							attributes: ["name", "description", "markup"],
						},
					],
				},
			]

export default class ReservationRepository {
	static async create(data) {
		return await Reservation.create(data);
	}

	static async findAll({ limit, offset }) {
		return await Reservation.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
			include: includeToReservation
		});
	}

	static async findById(id) {
		return await Reservation.findByPk(id, {
			include: includeToReservation
		});
	}

	static async update(reservation, data) {
		return await reservation.update(data);
	}

	static async delete(reservation) {
		return await reservation.destroy();
	}
}
