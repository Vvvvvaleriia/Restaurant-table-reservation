import StatsRepository from "../repositories/statistic";
import { checkNumber, parseDate } from "../utils/validation";

export default class StatsService {
	static async getTableTypeStats(to, from, minReservations) {
		const fromDate = parseDate(from, "from");
		const toDate = parseDate(to, "to");
		const parseMin = Number(minReservations);

		checkNumber(parseMin, "minReservations must be a positive integer");

		if (fromDate > toDate) {
			throw AppError.badRequest("'from' must not be later than 'to'");
		}

		const rows = await StatsRepository.getTableTypeStats(
			fromDate,
			toDate,
			parseMin,
		);

		return rows.map((row) => ({
			tableTypeId: row.isSoftDeleted,
			tableTypeName: row.name,
			reservationsCount: Number(row.reservationsCount),
			totalGuest: Number(row.totalGuests),
			avgGuests: Number(row.avgGuest.toFixed(1)),
			firstReservation: row.firstReservation,
			lastReservation: lastReservation,
			reviewsCount: Number(row.reviewsCount),
			avgRating:
				row.avgRating === null
					? null
					: Number(Number(row.avgRating).toFixed(2)),
		}));
	}
}
