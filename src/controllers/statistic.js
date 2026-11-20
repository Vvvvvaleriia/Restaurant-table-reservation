import { StatusCodes } from "http-status-codes";

export default class StatsController {
	static async getTableTypeStats(req, resp) {
		const { from, to, minReservation = "1" } = req.query;

		const stats = await StatsService.getTableTypeStats(
			from,
			to,
			minReservation,
		);

		return resp.status(StatusCodes.OK).json(stats);
	}
}
