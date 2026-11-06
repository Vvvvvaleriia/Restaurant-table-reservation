import ReservationRepository from "../repositories/reservation.js";
import TableRepository from "../repositories/table";
import UserRepository from "../repositories/user";

export default class ReservationService {
	static async create(data) {
		if (!data || typeof data !== "object" || Array.isArray(data)) {
			throw Object.assign(new Error("Request body must be an object"), {
				status: 400,
			});
		}

		const allowedFields = [
			"reservationDatetime",
			"guests",
			"status",
			"userId",
			"tableId",
		];

		const invalidFields = Object.keys(req.body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			return resp.status(400).json({
				message: "Request contains invalid fields",
			});
		}

		const { reservationDatetime, guests, status, userId, tableId } = data;

		if (
			reservationDatetime === undefined ||
			guests === undefined ||
			userId === undefined ||
			tableId === undefined
		) {
			throw Object.assign(
				new Error(
					"Reservation datetime, guests, user ID and table ID are required",
				),
				{ status: 400 },
			);
		}

		const reservationDate = new Date(reservationDatetime);

		if (
			typeof reservationDatetime !== "string" ||
			!reservationDatetime.trim() ||
			Number.isNaN(reservationDate.getTime())
		) {
			throw Object.assign(
				new Error("Invalid reservation date and time"),
				{ status: 400 },
			);
		}

		if (reservationDate <= new Date()) {
			throw Object.assign(
				new Error("Reservation date and time must be in the future"),
				{ status: 400 },
			);
		}

		if (!Number.isInteger(guests) || guests < 1) {
			throw Object.assign(
				new Error("Guests must be a positive integer"),
				{ status: 400 },
			);
		}

		if (
			status !== undefined &&
			!["active", "cancelled", "completed"].includes(status)
		) {
			throw Object.assign(new Error("Invalid reservation status"), {
				status: 400,
			});
		}

		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		if (typeof userId !== "string" || !uuidRegex.test(userId)) {
			throw Object.assign(new Error("Invalid user ID"), {
				status: 400,
			});
		}

		if (typeof tableId !== "string" || !uuidRegex.test(tableId)) {
			throw Object.assign(new Error("Invalid table ID"), {
				status: 400,
			});
		}

		const user = await UserRepository.findById(userId);

		if (!user) {
			throw Object.assign(new Error("User not found"), {
				status: 404,
			});
		}

		const table = await TableRepository.findById(tableId);

		if (!table) {
			return resp.status(404).json({
				message: "Table not found",
			});
		}

		if (guests > table.seats) {
			throw Object.assign(
				new Error("Number of guests exceeds table capacity"),
				{ status: 400 },
			);
		}

		return await ReservationRepository.create({
			reservationDatetime: reservationDate,
			guests,
			...(status !== undefined && { status }),
			userId,
			tableId,
		});
	}

	static async getAll(limit, page) {
		const parsedLimit = Number(limit);
		const parsedPage = Number(page);

		if (
			!Number.isInteger(parsedLimit) ||
			!Number.isInteger(parsedPage) ||
			parsedLimit < 1 ||
			parsedLimit > 100 ||
			parsedPage < 1
		) {
			throw Object.assign(
				new Error(
					"Limit must be 1-100 and page must be a positive integer",
				),
				{ status: 400 },
			);
		}

		const offset = (parsedPage - 1) * parsedLimit;

		return await ReservationRepository.findAll({
			parsedLimit,
			offset,
		});
	}

	static async getById(id) {
		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			return resp.status(400).json({
				message: "Invalid review ID",
			});
		}

		const reservation = await ReservationRepository.findById(id);

		if (!reservation) {
			return resp.status(404).json({
				message: "Reservation not found",
			});
		}

		return reservation;
	}

	static async update(id, date) {
		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			throw Object.assign(new Error("Invalid reservation ID"), {
				status: 400,
			});
		}

		if (!data || typeof data !== "object" || Array.isArray(data)) {
			throw Object.assign(new Error("Request body must be an object"), {
				status: 400,
			});
		}

		const allowedFields = [
			"reservationDatetime",
			"guests",
			"status",
			"userId",
			"tableId",
		];

		const fields = Object.keys(req.body);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			throw Object.assign(new Error("Invalid or empty request body"), {
				status: 400,
			});
		}

		const reservation = await ReservationRepository.findById(id);

		if (!reservation) {
			throw Object.assign(new Error("Reservation not found"), {
				status: 404,
			});
		}

		const { reservationDatetime, guests, status, userId, tableId } = data;

		let reservationDate = reservation.reservationDatetime;

		if (reservationDatetime !== undefined) {
			reservationDate = new Date(reservationDatetime);
			if (
				typeof reservationDatetime !== "string" ||
				!reservationDatetime.trim() ||
				Number.isNaN(reservationDate.getTime())
			) {
				throw Object.assign(
					new Error("Invalid reservation date and time"),
					{ status: 400 },
				);
			}
		}

		if (reservationDate <= new Date()) {
			throw Object.assign(
				new Error("Reservation date and time must be in the future"),
				{ status: 400 },
			);
		}

		if (guests !== undefined && (!Number.isInteger(guests) || guests < 1)) {
			throw Object.assign(
				new Error("Guests must be a positive integer"),
				{ status: 400 },
			);
		}

		if (
			status !== undefined &&
			!["active", "cancelled", "completed"].includes(status)
		) {
			throw Object.assign(new Error("Invalid reservation status"), {
				status: 400,
			});
		}

		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		if (userId !== undefined) {
			if (typeof userId !== "string" || !uuidRegex.test(userId)) {
				throw Object.assign(new Error("Invalid user ID"), {
					status: 400,
				});
			}

			const user = await UserRepository.findByPk(userId);

			if (!user) {
				throw Object.assign(new Error("User not found"), {
					status: 404,
				});
			}
		}

		let targetTable = await TableRepository.findById(
			tableId !== undefined ? tableId : reservation.tableId,
		);

		if (tableId !== undefined) {
			if (typeof tableId !== "string" || !uuidRegex.test(tableId)) {
				throw Object.assign(new Error("Invalid table ID"), {
					status: 400,
				});
			}
		}

		targetTable = await TableRepository.findById(tableId);

		if (!targetTable) {
			throw Object.assign(new Error("Table not found"), {
				status: 404,
			});
		}

		const targetGuests = guests !== undefined ? guests : reservation.guests;

		if (targetGuests > targetTable.seats) {
			throw Object.assign(
				new Error("Number of guests exceeds table capacity"),
				{ status: 400 },
			);
		}

		return await ReservationRepository.update(reservation, {
			...(reservationDatetime !== undefined && {
				reservationDatetime: reservationDate,
			}),
			...(guests !== undefined && { guests }),
			...(status !== undefined && { status }),
			...(userId !== undefined && { userId }),
			...(tableId !== undefined && { tableId }),
		});
	}

	static async delete(id) {
		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			throw Object.assign(new Error("Invalid reservation ID"), {
				status: 400,
			});
		}

		const reservation = await ReservationRepository.findById(id);

		if (!reservation) {
			throw Object.assign(new Error("Reservation not found"), {
				status: 404,
			});
		}

		return await ReservationRepository.delete(reservation);
	}
}
