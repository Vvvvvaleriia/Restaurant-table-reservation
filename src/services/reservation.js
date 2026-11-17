import ReservationRepository from "../repositories/reservation.js";
import TableRepository from "../repositories/table.js";
import UserRepository from "../repositories/user.js";
import { AppError } from "../errrors/AppError.js";

export default class ReservationService {
	static async create(userId, data) {
		const allowedFields = ["reservationDatetime", "guests", "tableId"];

		const invalidFields = Object.keys(data).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw AppError.badRequest("Request contains invalid fields");
		}

		const { reservationDatetime, guests, tableId } = data;

		if (
			reservationDatetime === undefined ||
			guests === undefined ||
			tableId === undefined
		) {
			throw AppError.badRequest(
				"Reservation datetime, guests and table ID are required",
			);
		}

		const reservationDate = new Date(reservationDatetime);

		if (
			typeof reservationDatetime !== "string" ||
			!reservationDatetime.trim() ||
			Number.isNaN(reservationDate.getTime())
		) {
			throw AppError.badRequest("Invalid reservation date and time");
		}

		if (reservationDate <= new Date()) {
			throw AppError.badRequest(
				"Reservation date and time must be in the future",
			);
		}

		if (!Number.isInteger(guests) || guests < 1) {
			throw AppError.badRequest("Guests must be a positive integer");
		}

		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		if (typeof tableId !== "string" || !uuidRegex.test(tableId)) {
			throw AppError.badRequest("Invalid table ID");
		}

		const user = await UserRepository.findById(userId);

		if (!user) {
			throw AppError.notFound("User not found");
		}

		const table = await TableRepository.findById(tableId);

		if (!table) {
			throw AppError.notFound("Table not found");
		}

		if (guests > table.seats) {
			throw AppError.badRequest(
				"Number of guests exceeds table capacity",
			);
		}

		const reservedTable = await ReservationRepository.findTimeConflict(
			tableId,
			reservationDatetime,
		);

		if (reservedTable) {
			throw AppError.conflict(
				"This table has active reservation for this time",
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
			throw AppError.badRequest(
				"Limit must be 1-100 and page must be a positive integer",
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
			throw AppError.notFound("Reservation not found");
		}

		if (reservation.userId !== userId && role !== "admin") {
			throw AppError.forbidden("Access denied");
		}

		return reservation;
	}

	static async update(id, data) {
		const allowedFields = [
			"reservationDatetime",
			"guests",
			"tableId",
			"status",
		];

		const fields = Object.keys(data);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			throw AppError.badRequest("Invalid or empty request body");
		}

		const reservation = await ReservationRepository.findById(id);

		if (!reservation) {
			throw AppError.notFound("Reservation not found");
		}

		if (reservation.reservationDatetime <= new Date()) {
			throw AppError.conflict("Reservation can`t be updated");
		}

		const { reservationDatetime, guests, tableId, status } = data;

		if (
			status !== undefined &&
			(typeof status !== "string" ||
				!["active", "cancelled", "completed"].includes(status))
		) {
			throw AppError.badRequest(
				"Status must be string with meaning active, cancelled or completed",
			);
		}

		let reservationDate = reservation.reservationDatetime;

		if (reservationDatetime !== undefined) {
			reservationDate = Date(reservationDatetime);
			if (
				typeof reservationDatetime !== "string" ||
				!reservationDatetime.trim() ||
				Number.isNaN(reservationDate.getTime())
			) {
				throw AppError.badRequest("Invalid reservation date and time");
			}

			if (reservationDate <= new Date()) {
				throw AppError.badRequest(
					"Reservation date and time must be in the future",
				);
			}
		}

		if (guests !== undefined && (!Number.isInteger(guests) || guests < 1)) {
			throw AppError.badRequest("Guests must be a positive integer");
		}

		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		if (tableId !== undefined) {
			if (typeof tableId !== "string" || !uuidRegex.test(tableId)) {
				throw AppError.badRequest("Invalid table ID");
			}
		}

		const targetTable = await TableRepository.findById(
			tableId !== undefined ? tableId : reservation.tableId,
		);

		if (!targetTable) {
			throw AppError.notFound("Table not found");
		}

		const targetGuests = guests !== undefined ? guests : reservation.guests;

		if (targetGuests > targetTable.seats) {
			throw AppError.badRequest(
				"Number of guests exceeds table capacity",
			);
		}

		const targetStatus = status !== undefined ? status : reservation.status;

		if (
			targetStatus === "active" &&
			(reservationDatetime !== undefined ||
				tableId !== undefined ||
				reservation.status !== "active")
		) {
			const reservedTable = await ReservationRepository.findTimeConflict(
				tableId !== undefined ? tableId : reservation.tableId,
				reservationDate,
				id,
			);

			if (reservedTable) {
				throw AppError.conflict("This table can`t be reserved");
			}
		}

		return await ReservationRepository.update(reservation, {
			...(reservationDatetime !== undefined && {
				reservationDatetime: reservationDate,
			}),
			...(guests !== undefined && { guests }),
			...(tableId !== undefined && { tableId }),
			...(status !== undefined && { status }),
		});
	}

	static async cancel(userId, role, id) {
		const reservation = await ReservationRepository.findById(id);

		if (!reservation) {
			throw AppError.notFound("Reservation not found");
		}

		if (reservation.userId !== userId && role !== "admin") {
			throw AppError.forbidden("Access denied");
		}

		if (["cancelled", "completed"].includes(reservation.status)) {
			throw AppError.conflict("Reservation can't be cancelled");
		}

		if (role !== "admin") {
			if (reservation.reservationDatetime <= new Date()) {
				throw new AppError.conflict(
					"Reservation has already started or passed",
				);
			}
		}

		return await ReservationRepository.update(reservation, {
			status: "cancelled",
		});
	}

	static async delete(userId, role, id) {
		const reservation = await ReservationRepository.findById(id);

		if (!reservation) {
			throw AppError.notFound("Reservation not found");
		}

		if (reservation.userId !== userId && role !== "admin") {
			throw AppError.forbidden("Access denied");
		}

		return await ReservationRepository.delete(reservation);
	}
}
