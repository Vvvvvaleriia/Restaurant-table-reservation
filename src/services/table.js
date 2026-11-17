import TableRepository from "../repositories/table.js";
import TableTypeRepository from "../repositories/tableType.js";
import { AppError } from "../errrors/AppError.js";

export default class TableService {
	static async create(data) {
		const allowedFields = ["tableNumber", "seats", "tableTypeId"];
		const invalidFields = Object.keys(data).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw AppError.badRequest("Request contains invalid fields");
		}

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

		if (!Number.isInteger(tableNumber) || tableNumber < 1) {
			throw AppError.badRequest(
				"Table number must be a positive integer",
			);
		}

		if (!Number.isInteger(seats) || seats < 1) {
			throw AppError.badRequest("Seats must be a positive number");
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				tableTypeId,
			)
		) {
			throw AppError.badRequest("Invalid table type ID");
		}

		const tableType = await TableTypeRepository.findById(tableTypeId);

		if (!tableType) {
			throw AppError.notFound("Table type not found");
		}

		const existingTableNumber =
			await TableRepository.findByNumber(tableNumber);

		if (existingTableNumber) {
			throw AppError.conflict("This table number already exists");
		}

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

		const { count, rows } = await TableRepository.findAll({
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

	static async getById(id) {
		const table = await TableRepository.findById(id);

		if (!table) {
			throw AppError.notFound("Table not found");
		}

		return table;
	}

	static async update(id, data) {
		const allowedFields = ["tableNumber", "seats", "tableTypeId"];
		const fields = Object.keys(data);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			throw AppError.badRequest("Invalid or empty request body");
		}

		const table = await TableRepository.findById(id);

		if (!table) {
			throw AppError.notFound("Table not found");
		}

		const { tableNumber, seats, tableTypeId } = data;

		if (
			tableNumber !== undefined &&
			(!Number.isInteger(tableNumber) || tableNumber < 1)
		) {
			throw AppError.badRequest(
				"Table number must be a positive integer",
			);
		}

		if (seats !== undefined && (!Number.isInteger(seats) || seats < 1)) {
			throw AppError.badRequest("Seats must be a positive integer");
		}

		if (tableTypeId !== undefined) {
			if (
				!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
					tableTypeId,
				)
			) {
				throw AppError.badRequest("Invalid table type ID");
			}
		}

		if (tableTypeId !== undefined) {
			const tableType = await TableTypeRepository.findById(tableTypeId);

			if (!tableType) {
				throw AppError.notFound("Table type not found");
			}
		}

		if (tableNumber !== undefined) {
			const existingTable =
				await TableRepository.findByNumber(tableNumber);

			if (existingTable && existingTable.id !== table.id) {
				throw AppError.conflict("This table number already exists");
			}
		}

		await TableRepository.update(table, {
			...(tableNumber !== undefined && { tableNumber }),
			...(seats !== undefined && {
				seats,
			}),
			...(tableTypeId !== undefined && { tableTypeId }),
		});

		return table;
	}

	static async delete(id) {
		const table = await TableRepository.findById(id);

		if (!table) {
			throw AppError.notFound("Table not found");
		}

		return await TableRepository.delete(table);
	}
}
