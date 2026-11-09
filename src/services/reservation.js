import ReservationRepository from "../repositories/reservation.js";
import TableRepository from "../repositories/table.js";
import UserRepository from "../repositories/user.js";
import { StatusCodes } from "http-status-codes";

export default class ReservationService {
	static async create(userId, data) {
		const allowedFields = ["reservationDatetime", "guests", "tableId"];

		const invalidFields = Object.keys(data).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw Object.assign(new Error("Request contains invalid fields"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const { reservationDatetime, guests, tableId } = data;

		if (
			reservationDatetime === undefined ||
			guests === undefined ||
			tableId === undefined
		) {
			throw Object.assign(
				new Error(
					"Reservation datetime, guests and table ID are required",
				),
				{ status: StatusCodes.BAD_REQUEST },
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
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		if (reservationDate <= new Date()) {
			throw Object.assign(
				new Error("Reservation date and time must be in the future"),
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		if (!Number.isInteger(guests) || guests < 1) {
			throw Object.assign(
				new Error("Guests must be a positive integer"),
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		if (typeof tableId !== "string" || !uuidRegex.test(tableId)) {
			throw Object.assign(new Error("Invalid table ID"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const user = await UserRepository.findById(userId);

		if (!user) {
			throw Object.assign(new Error("User not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		const table = await TableRepository.findById(tableId);

		if (!table) {
			throw Object.assign(new Error("Table not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		if (guests > table.seats) {
			throw Object.assign(
				new Error("Number of guests exceeds table capacity"),
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		return await ReservationRepository.create({
			reservationDatetime: reservationDate,
			guests,
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
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		const offset = (parsedPage - 1) * parsedLimit;

		const { count, rows } = await ReservationRepository.findAll({
			limit: parsedLimit,
			offset,
		});

		return {
			data: rows,
			pagination: {
				totalItems: count,
				totalPages: Math.ceil(count / parsedLimit),
				currentPage: parsedPage,
				limit: parsedLimit,
			},
		};
	}

	static async getById(userId, role, id) {
		const reservation = await ReservationRepository.findById(id);

		if (!reservation) {
			throw Object.assign(new Error("Reservation not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		if (reservation.userId !== userId && role !== "admin") {
			throw Object.assign(new Error("Access denied"), {
				status: StatusCodes.FORBIDDEN,
			});
		}

		return reservation;
	}

	static async update(userId, role, id, data) {
		const allowedFields = ["reservationDatetime", "guests", "tableId"];

		const fields = Object.keys(data);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			throw Object.assign(new Error("Invalid or empty request body"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const reservation = await ReservationRepository.findById(id);

		if (!reservation) {
			throw Object.assign(new Error("Reservation not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		if (reservation.userId !== userId && role !== "admin") {
			throw Object.assign(new Error("Access denied"), {
				status: StatusCodes.FORBIDDEN,
			});
		}

		const { reservationDatetime, guests, tableId } = data;

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
					{ status: StatusCodes.BAD_REQUEST },
				);
			}

			if (reservationDate <= new Date()) {
				throw Object.assign(
					new Error(
						"Reservation date and time must be in the future",
					),
					{ status: StatusCodes.BAD_REQUEST },
				);
			}
		}

		if (guests !== undefined && (!Number.isInteger(guests) || guests < 1)) {
			throw Object.assign(
				new Error("Guests must be a positive integer"),
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		if (tableId !== undefined) {
			if (typeof tableId !== "string" || !uuidRegex.test(tableId)) {
				throw Object.assign(new Error("Invalid table ID"), {
					status: StatusCodes.BAD_REQUEST,
				});
			}
		}

		const targetTable = await TableRepository.findById(
			tableId !== undefined ? tableId : reservation.tableId,
		);

		if (!targetTable) {
			throw Object.assign(new Error("Table not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		const targetGuests = guests !== undefined ? guests : reservation.guests;

		if (targetGuests > targetTable.seats) {
			throw Object.assign(
				new Error("Number of guests exceeds table capacity"),
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		return await ReservationRepository.update(reservation, {
			...(reservationDatetime !== undefined && {
				reservationDatetime: reservationDate,
			}),
			...(guests !== undefined && { guests }),
			...(tableId !== undefined && { tableId }),
		});
	}

	static async delete(userId, role, id) {
		const reservation = await ReservationRepository.findById(id);

		if (!reservation) {
			throw Object.assign(new Error("Reservation not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		if (reservation.userId !== userId && role !== "admin") {
			throw Object.assign(new Error("Access denied"), {
				status: StatusCodes.FORBIDDEN,
			});
		}

		return await ReservationRepository.delete(reservation);
	}
}
