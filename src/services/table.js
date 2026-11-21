import TableRepository from "../repositories/table.js";
import { AppError } from "../errors/AppError.js";
import { sequelize } from "../db.js";
import { paginatedResponse, parsePagination } from "../utils/pagination.js";
import {
	checkAllowedFields,
	checkNumber,
	checkUuid,
} from "../utils/validation.js";
import {
	tableExists,
	tableNumberExists,
	tableTypeExists,
} from "../utils/exists.js";

export default class TableService {
	static async create(data) {
		const allowedFields = ["tableNumber", "seats", "tableTypeId"];
		checkAllowedFields(allowedFields, data);

		const { tableNumber, seats, tableTypeId } = data;

		if (
			tableNumber === undefined ||
			seats === undefined ||
			tableTypeId === undefined
		) {
			throw AppError.badRequest(
				"Table number, seats and table type id are required",
			);
		}

		checkNumber(tableNumber, "Table number must be positive integer");
		checkNumber(seats, "Seats must be positive integer");

		checkUuid(tableTypeId, "table type");

		await tableTypeExists(tableTypeId);

		await tableNumberExists(tableNumber);

		const table = await TableRepository.create({
			tableNumber,
			seats,
			tableTypeId,
		});

		return {
			id: table.id,
			tableNumber: table.tableNumber,
			seats: table.seats,
			tableTypeId: table.tableTypeId,
		};
	}

	static async getAll(limit, page) {
		const parsedLimit = Number(limit);
		const parsedPage = Number(page);

		const { offset } = parsePagination(parsedLimit, parsedPage);

		const { count, rows } = await TableRepository.findAll({
			limit: parsedLimit,
			offset,
		});

		return paginatedResponse(count, rows, parsedLimit, parsedPage);
	}

	static async getById(id) {
		return await tableExists(id);
	}

	static async update(id, data) {
		const allowedFields = ["tableNumber", "seats", "tableTypeId"];
		checkAllowedFields(allowedFields, data);

		const { tableNumber, seats, tableTypeId } = data;

		const table = await tableExists(id);

		const changes = {};

		if (tableNumber !== undefined) {
			checkNumber(tableNumber, "Table number must be positive integer");

			if (tableNumber !== table.tableNumber) {
				await tableNumberExists(tableNumber);
			}
			changes.tableNumber = tableNumber;
		}

		if (seats !== undefined) {
			checkNumber(seats, "Seats must be positive integer");
			changes.seats = seats;
		}

		if (tableTypeId !== undefined) {
			checkUuid(tableTypeId, "table type");
			await tableTypeExists(tableTypeId);
			changes.tableTypeId = tableTypeId;
		}

		await TableRepository.update(table, changes);

		return table;
	}

	static async delete(id) {
		const transaction = await sequelize.transaction();

		try {
			const table = await tableExists(id);

			await ReservationRepository.cancelActiveByTableId(id, transaction);
			await TableRepository.softDeletede(table, transaction);

			await transaction.commit();
			return table;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}
