import { col } from "sequelize";
import { TableType } from "../models";

export default class StatsRepository {
	static async getTableTypeStats({ from, to, minReservations }) {
		const reservationId = col("tables->reservations.id");
		const reservationGuests = col("tables->reservations.guests");
		const reservationDatetime = col(
			"tables->reservations.reservationDatetime",
		);
		const reviewId = col("tables->reservations->review.id");
		const reviewRating = col("tables->reservations->review.rating");

		return await TableType.findAll({
			attributes: [
				"id",
				"name",
				[(fn("COUNT", reservationId), "reservationsCount")],
				[fn("SUM", reservationGuests), "totalGuests"],
				[fn("AVG", reservationGuests), "avgGuests"],
				[fn("MIN", reservationDatetime), "firstReservation"],
				[fn("MAX", reservationDatetime), "lastReservation"],
				[fn("COUNT", reviewId), "reviewsCount"],
				[fn("AVG", reviewRating), "avgRating"],
			],
			include: [
				{
					model: Table,
					as: "tables",
					attributes: [],
					required: true,
					include: [
						{
							model: Reservation,
							as: "reservations",
							attributes: [],
							required: true,
							where: {
								status: "completed",
								reservationDatetime: {
									[Op.between]: [from, to],
								},
							},
							include: [
								{
									model: Review,
									as: "review",
									attributes: [],
									required: false,
								},
							],
						},
					],
				},
			],
			group: ["TableType.id", "TableType.name"],
			having: where(fn("COUNT", reservationId), Op.gte, minReservations),
			order: [[literal('"reservationsCount"'), "DESC"]],
			raw: true,
		});
	}
}
