import { Reservation, Table, TableType, User } from "../models/index.js";
import { Op, Sequelize } from "sequelize";

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
];

export default class ReservationRepository {
	static async create(data) {
		return await Reservation.create(data);
	}

	static async findAll({ limit, offset }) {
		return await Reservation.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
			include: includeToReservation,
		});
	}

	static async findById(id) {
		return await Reservation.findByPk(id, {
			include: includeToReservation,
		});
	}

	static async findTimeConflict(tableId, dataTime, excludeId = undefined) {
		const start = new Date(dataTime);
		const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

		const where = {
			tableId,
			status: "active",
			[Op.and]: [
				Sequelize.where(
					Sequelize.col("reservation_datetime"),
					Op.lt,
					end,
				),
				Sequelize.where(
					Sequelize.literal(
						`"reservation_datetime" + INTERVAL '2 hours'`,
					),
					Op.gt,
					start,
				),
			],
		};

		if (excludeId) {
			where.id = { [Op.ne]: excludeId };
		}

		return await Reservation.findOne({
			where,
		});
	}

	static async update(reservation, data) {
		return await reservation.update(data);
	}

	static async delete(reservation) {
		return await reservation.destroy();
	}
}
