import ReservationService from "../services/reservation.js";
import { StatusCodes } from "http-status-codes";

export default class ReservationController {
	static async create(req, resp) {
		try {
			const reservation = await ReservationService.create(
				req.user.id,
				req.body,
			);

			return resp.status(StatusCodes.CREATED).json(reservation);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}

	static async getAll(req, resp) {
		try {
			const { limit = 10, page = "1" } = req.query;

			const reservations = await ReservationService.getAll(limit, page);

			return resp.status(StatusCodes.OK).json(reservations);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}

	static async getById(req, resp) {
		try {
			const reservation = await ReservationService.getById(
				req.user.id,
				req.user.role,
				req.params.id,
			);

			return resp.status(StatusCodes.OK).json(reservation);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}

	static async update(req, resp) {
		try {
			const reservation = await ReservationService.update(
				req.user.id,
				req.user.role,
				req.params.id,
				req.body,
			);

			return resp.status(StatusCodes.OK).json(reservation);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}

	static async delete(req, resp) {
		try {
			await ReservationService.delete(
				req.user.id,
				req.user.role,
				req.params.id,
			);

			return resp.status(StatusCodes.OK).json({
				message: "Reservation deleted successfuly",
			});
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error",
			});
		}
	}
}
