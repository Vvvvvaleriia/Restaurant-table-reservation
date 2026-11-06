import TableRepository from "../repositories/table.js";
import TableTypeRepository from "../repositories/tableType";

export default class TableService {
	static async create(data) {
		if (!data || typeof data !== "object" || Array.isArray(data)) {
			throw Object.assign(new Error("Request body must be an object"), {
				status: 400,
			});
		}

		const allowedFields = ["tableNumber", "seats", "tableTypeId"];
		const invalidFields = Object.keys(data).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw Object.assign(new Error("Request contains invalid fields"), {
				status: 400,
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
				{ status: 400 },
			);
		}

		if (!Number.isFinite(tableNumber) || tableNumber < 1) {
			throw Object.assign(
				new Error("Table number must be a positive number"),
				{ status: 400 },
			);
		}

		if (!Number.isFinite(seats) || seats < 1) {
			throw Object.assign(new Error("Seats must be a positive number"), {
				status: 400,
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				tableTypeId,
			)
		) {
			throw Object.assign(new Error("Invalid table type ID"), {
				status: 400,
			});
		}

		const tableType = await TableTypeRepository.findById(tableTypeId);

		if (!tableType) {
			throw Object.assign(new Error("Table type not found"), {
				status: 404,
			});
		}

		const existingTableNumber = await TableRepository.findByNumber({
			where: { tableNumber },
		});

		if (existingTableNumber) {
			return resp.status(409).json({
				message: "This table number is already exists",
			});
		}

		const table = await TableRepository.create({
			tableNumber,
			seats,
			tableTypeId,
		});

		resp.status(201).json({
			id: table.id,
			tableNumber: table.tableNumber,
			seats: table.seats,
			tableTypeId: table.tableTypeId,
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

		return await TableRepository.findAll({
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
			throw Object.assign(new Error("Invalid table ID"), {
				status: 400,
			});
		}

		const table = await TableRepository.findByPk(id);

		if (!table) {
			throw Object.assign(new Error("Table not found"), {
				status: 404,
			});
		}

		return table;
	}

	static async update(id, data) {
		if (!data || typeof data !== "object" || Array.isArray(data)) {
			throw Object.assign(new Error("Request body must be an object"), {
				status: 400,
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			throw Object.assign(new Error("Invalid table ID"), {
				status: 400,
			});
		}

		const allowedFields = ["tableNumber", "seats", "tableTypeId"];
		const fields = Object.keys(req.body);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			throw Object.assign(new Error("Invalid or empty request body"), {
				status: 400,
			});
		}

		const table = await TableRepository.findById(id);

		if (!table) {
			throw Object.assign(new Error("Table not found"), {
				status: 404,
			});
		}

		const { tableNumber, seats, tableTypeId } = data;

		if (
			tableNumber !== undefined &&
			(!Number.isInteger(tableNumber) || tableNumber < 1)
		) {
			throw Object.assign(
				new Error("Table number must be a positive integer"),
				{ status: 400 },
			);
		}

		if (seats !== undefined && (!Number.isInteger(seats) || seats < 1)) {
			throw Object.assign(new Error("Seats must be a positive integer"), {
				status: 400,
			});
		}

		if (tableTypeId !== undefined) {
			if (
				!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
					tableTypeId,
				)
			) {
				throw Object.assign(new Error("Invalid table type ID"), {
					status: 400,
				});
			}
		}

		const tableType = await TableTypeRepository.findById(tableTypeId);

		if (!tableType) {
			throw Object.assign(new Error("Table type not found"), {
				status: 404,
			});
		}

		if (tableNumber !== undefined) {
			const existingTable = await TableRepository.findByNumber({
				tableNumber,
			});

			if (existingTable && existingTable.id !== id) {
				throw Object.assign(
					new Error("This table number already exists"),
					{ status: 409 },
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
		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			throw Object.assign(new Error("Invalid table ID"), {
				status: 400,
			});
		}

		const table = await TableRepository.findById(id);

		if (!table) {
			throw Object.assign(new Error("Table not found"), {
				status: 404,
			});
		}

		return await TableRepository.delete(table);
	}
}
