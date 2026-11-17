import ReservationService from "../services/reservation.js";
import { StatusCodes } from "http-status-codes";

export default class ReservationController {
	static async create(req, resp) {
		const reservation = await ReservationService.create(
			req.user.id,
			req.body,
		);

		return resp.status(StatusCodes.CREATED).json(reservation);
	}

	static async getAll(req, resp) {
		const { limit = 10, page = "1" } = req.query;

		const reservations = await ReservationService.getAll(limit, page);

		return resp.status(StatusCodes.OK).json(reservations);
	}

	static async getById(req, resp) {
		const reservation = await ReservationService.getById(
			req.user.id,
			req.user.role,
			req.params.id,
		);

		return resp.status(StatusCodes.OK).json(reservation);
	}

	static async update(req, resp) {
		const reservation = await ReservationService.update(
			req.params.id,
			req.body,
		);

		return resp.status(StatusCodes.OK).json(reservation);
	}

	static async cancel(req, resp) {
		const reservation = await ReservationService.cancel(
			req.user.id,
			req.user.role,
			req.params.id,
		);

		return resp.status(StatusCodes.OK).json(reservation);
	}

	static async delete(req, resp) {
		await ReservationService.delete(
			req.user.id,
			req.user.role,
			req.params.id,
		);

		return resp.status(StatusCodes.OK).json({
			message: "Reservation deleted successfuly",
		});
	}
}
