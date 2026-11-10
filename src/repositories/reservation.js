import { Reservation } from "../models/reservation.js";
import { Table } from "../models/table.js";
import { TableType } from "../models/tableType.js";
import { User } from "../models/user.js";

export default class ReservationRepository {
	static async create(data) {
		return await Reservation.create(data);
	}

	static async findAll({ limit, offset }) {
		return await Reservation.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: User,
					attributes: ["name", "email"],
				},
				{
					model: Table,
					attributes: ["tableNumber", "seats"],
					include: [
						{
							model: TableType,
							attributes: ["name", "description", "markup"],
						},
					],
				},
			],
		});
	}

	static async findById(id) {
		return await Reservation.findByPk(id, {
			include: [
				{
					model: User,
					attributes: ["name", "email"],
				},
				{
					model: Table,
					attributes: ["tableNumber", "seats"],
					include: [
						{
							model: TableType,
							attributes: ["name", "description", "markup"],
						},
					],
				},
			],
		});
	}

	static async update(reservation, data) {
		return await reservation.update(data);
	}

	static async delete(reservation) {
		return await reservation.destroy();
	}
}
