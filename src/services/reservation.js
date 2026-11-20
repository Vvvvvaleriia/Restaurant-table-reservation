import ReservationRepository from "../repositories/reservation.js";
import { AppError } from "../errors/AppError.js";
import { sequelize } from "../db.js";
import { paginatedResponse, parsePagination } from "../utils/pagination.js";
import {
	checkAllowedFields,
	checkNumber,
	checkUuid,
	parseFutureDate,
} from "../utils/validation.js";
import {
	reservationExists,
	reservedTableExists,
	tableExists,
	userExists,
} from "../utils/exists.js";
import { checkOwnerOrAdmin } from "../utils/access.js";

const STATUSES = ["active", "cancelled", "completed"];

export default class ReservationService {
	static async create(userId, data) {
		const allowedFields = ["reservationDatetime", "guests", "tableId"];
		checkAllowedFields(allowedFields, data);

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

		const reservationDate = parseFutureDate(reservationDatetime);
		checkNumber(guests, "Guests must be a positive integer");
		checkUuid(tableId, "table");

		await userExists(userId);

		const table = await tableExists(tableId);

		if (guests > table.seats) {
			throw AppError.badRequest(
				"Number of guests exceeds table capacity",
			);
		}

		await checkTableAvailable(tableId, reservationDate);

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

		const { offset } = parsePagination(parsedLimit, parsedPage);

		const { count, rows } = await ReservationRepository.findAll({
			limit: parsedLimit,
			offset,
		});

		return paginatedResponse(count, rows, parsedLimit, parsedPage);
	}

	static async getById(userId, role, id) {
		const reservation = await reservedTableExists(id);

		checkOwnerOrAdmin(reservation.userId, userId, role);

		return reservation;
	}

	static async update(id, data) {
		const allowedFields = [
			"reservationDatetime",
			"guests",
			"tableId",
			"status",
		];
		checkAllowedFields(allowedFields, data);

		const reservation = await reservationExists(id);

		const changesDetails =
			reservationDatetime !== undefined ||
			guests !== undefined ||
			tableId !== undefined;

		if (changesDetails && reservation.reservationDatetime <= new Date()) {
			throw AppError.conflict("Reservation can't be updated");
		}

		const changes = {};

		if (status !== undefined) {
			checkEnum(
				status,
				STATUSES,
				"Status must be active, cancelled or completed",
			);
			changes.status = status;
		}

		if (reservationDatetime !== undefined) {
			changes.reservationDatetime = parseFutureDate(reservationDatetime);
		}

		if (guests !== undefined) {
			checkNumber(guests, "Guests must be a positive integer");
			changes.guests = guests;
		}

		if (tableId !== undefined) {
			checkUuid(tableId, "table");
			changes.tableId = tableId;
		}

		const targetTableId = changes.tableId ?? reservation.tableId;
		const targetGuests = changes.guests ?? reservation.guests;
		const targetStatus = changes.status ?? reservation.status;
		const targetDate =
			changes.reservationDatetime ?? reservation.reservationDatetime;

		const targetTable = await tableExists(targetTableId);

		if (targetGuests > targetTable.seats) {
			throw AppError.badRequest(
				"Number of guests exceeds table capacity",
			);
		}

		if (
			targetStatus === "active" &&
			(changesDetails || reservation.status !== "active")
		) {
			await checkTableAvailable(targetTableId, targetDate, id);
		}

		return await ReservationRepository.update(reservation, changes);
	}

	static async cancel(userId, role, id) {
		const reservation = await reservationExists(id);

		checkOwnerOrAdmin(reservation.userId, userId, role);

		if (["cancelled", "completed"].includes(reservation.status)) {
			throw AppError.conflict("Reservation can't be cancelled");
		}

		if (role !== "admin" && reservation.reservationDatetime <= new Date()) {
			throw new AppError.conflict(
				"Reservation has already started or passed",
			);
		}

		return await ReservationRepository.update(reservation, {
			status: "cancelled",
		});
	}

	static async delete(userId, role, id) {
		const transaction = await sequelize.transaction();

		try {
			const reservation = await reservationExists(id, transaction);

			checkOwnerOrAdmin(reservation.userId, userId, role);

			await ReviewRepository.deleteByReservationId(id, transaction);
			await ReservationRepository.softDelete(reservation, transaction);

			await transaction.commit();
			return reservation;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}
