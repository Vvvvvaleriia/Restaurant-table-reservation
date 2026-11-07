import ReservationService from "../services/reservation.js";

export default class ReservationController {
	static async create(req, resp) {
		try {
			const reservation = await ReservationService.create(req.body);

			return resp.status(201).json(reservation);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
				message: "Internal server error",
			});
		}
	}

	static async getAll(req, resp) {
		try {
			const { limit = 10, page = "1" } = req.query;

			const reservations = ReservationService.getAll(limit, page);

			return resp.status(200).json(reservations);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
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

			return resp.status(201).json(reservation);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
				message: "Internal server error",
			});
		}
	}

	static async update(req, resp) {
		try {
			const reservation = ReservationService.update(
				req.user.id,
				req.user.role,
				req.params.id,
				req.body,
			);

			return resp.status(200).json(reservation);
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
				message: "Internal server error",
			});
		}
	}

	static async delete(req, resp) {
		try {
			await ReviewService.delete(
				req.user.id,
				req.user.role,
				req.params.id,
			);

			return resp.status(200).json({
				message: "Reservation delete successfuly",
			});
		} catch (error) {
			if (error.status) {
				return resp.status(error.status).json({
					message: error.message,
				});
			}

			return resp.status(500).json({
				message: "Internal server error",
			});
		}
	}
}
