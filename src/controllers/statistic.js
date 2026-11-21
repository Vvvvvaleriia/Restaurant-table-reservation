import { StatusCodes } from "http-status-codes";
import StatsService from "../services/statistic.js";

export default class StatsController {
	static async getTableTypeStats(req, resp) {
		const { from, to, minReservations = "1" } = req.query;

		console.log(req.query);
		console.log(from, to, minReservations);

		const stats = await StatsService.getTableTypeStats({
			from,
			to,
			minReservations,
		});

		return resp.status(StatusCodes.OK).json(stats);
	}
}
