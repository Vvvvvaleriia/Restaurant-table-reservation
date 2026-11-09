import TableRepository from "../repositories/table.js";
import TableTypeRepository from "../repositories/tableType.js";
import { StatusCodes } from "http-status-codes";

export default class TableService {
	static async create(data) {
		const allowedFields = ["tableNumber", "seats", "tableTypeId"];
		const invalidFields = Object.keys(data).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw Object.assign(new Error("Request contains invalid fields"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const { tableNumber, seats, tableTypeId } = data;

		if (
			tableNumber === undefined ||
			seats === undefined ||
			tableTypeId === undefined
		) {
			throw Object.assign(
				new Error("Table number, seats and table type id are required"),
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		if (!Number.isInteger(tableNumber) || tableNumber < 1) {
			throw Object.assign(
				new Error("Table number must be a positive number"),
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		if (!Number.isInteger(seats) || seats < 1) {
			throw Object.assign(new Error("Seats must be a positive number"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				tableTypeId,
			)
		) {
			throw Object.assign(new Error("Invalid table type ID"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const tableType = await TableTypeRepository.findById(tableTypeId);

		if (!tableType) {
			throw Object.assign(new Error("Table type not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		const existingTableNumber =
			await TableRepository.findByNumber(tableNumber);

		if (existingTableNumber) {
			throw Object.assign(new Error("This table number already exists"), {
				status: StatusCodes.CONFLICT,
			});
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
			throw Object.assign(
				new Error(
					"Limit must be 1-100 and page must be a positive integer",
				),
				{ status: StatusCodes.BAD_REQUEST },
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
			throw Object.assign(new Error("Table not found"), {
				status: StatusCodes.NOT_FOUND,
			});
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
			throw Object.assign(new Error("Invalid or empty request body"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const table = await TableRepository.findById(id);

		if (!table) {
			throw Object.assign(new Error("Table not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		const { tableNumber, seats, tableTypeId } = data;

		if (
			tableNumber !== undefined &&
			(!Number.isInteger(tableNumber) || tableNumber < 1)
		) {
			throw Object.assign(
				new Error("Table number must be a positive integer"),
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		if (seats !== undefined && (!Number.isInteger(seats) || seats < 1)) {
			throw Object.assign(new Error("Seats must be a positive integer"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		if (tableTypeId !== undefined) {
			if (
				!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
					tableTypeId,
				)
			) {
				throw Object.assign(new Error("Invalid table type ID"), {
					status: StatusCodes.BAD_REQUEST,
				});
			}
		}

		if (tableTypeId !== undefined) {
			const tableType = await TableTypeRepository.findById(tableTypeId);

			if (!tableType) {
				throw Object.assign(new Error("Table type not found"), {
					status: StatusCodes.NOT_FOUND,
				});
			}
		}

		if (tableNumber !== undefined) {
			const existingTable =
				await TableRepository.findByNumber(tableNumber);

			if (existingTable && existingTable.id !== table.id) {
				throw Object.assign(
					new Error("This table number already exists"),
					{ status: StatusCodes.CONFLICT },
				);
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
			throw Object.assign(new Error("Table not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		return await TableRepository.delete(table);
	}
}
