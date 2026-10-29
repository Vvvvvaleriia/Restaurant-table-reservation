import { Router } from "express";
import { Reservation, Table, TableType } from "../models";

export const router = Router();

router.post("/", async (req, resp) => {
	try {
		if (
			!req.body ||
			typeof req.body !== "object" ||
			Array.isArray(req.body)
		) {
			return resp.status(400).json({
				message: "Request body must be an object",
			});
		}

		const allowedFields = ["tableNumber", "seats"];
		const invalidFields = Object.keys(req.body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			return resp.status(400).json({
				message: "Request contains invalid fields",
			});
		}

		const { tableNumber, seats, tableTypeId } = req.body;

		if (
			tableNumber === undefined ||
			seats === undefined ||
			tableTypeId === undefined
		) {
			return resp.status(400).json({
				message: "Table number, seats and table type id are required",
			});
		}

		if (!Number.isFinite(tableNumber) || tableNumber < 1) {
			return resp.status(400).json({
				message: "Table number must be a positive number",
			});
		}

		if (!Number.isFinite(seats) || seats < 1) {
			return resp.status(400).json({
				message: "Seats must be a positive number",
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				tableTypeId,
			)
		) {
			return resp.status(400).json({
				message: "Invalid table type ID",
			});
		}

		const tableType = await TableType.findByPk(tableTypeId);

		if (!tableType) {
			return resp.status(404).json({
				message: "Table type not found",
			});
		}

		const existingTableNumber = await Table.findOne({
			where: { tableNumber },
		});

		if (existingTableNumber) {
			return resp.status(409).json({
				message: "This table number is already exists",
			});
		}

		const table = await Table.create({
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
	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			return resp.status(409).json({
				message: "This table number already exists",
			});
		}

		// if (error.name === "SequelizeValidationError") {
		// 	return resp.status(400).json({
		// 		message: error.message,
		// 	});
		// }

		return resp.status(500).json({
			message: "Internal server error",
		});
	}
});

router.get("/", async (req, resp) => {
	const { limit = "10", page = "1" } = req.query;

	try {
		const parsedLimit = Number(limit);
		const parsedPage = Number(page);

		if (
			!Number.isInteger(parsedLimit) ||
			!Number.isInteger(parsedPage) ||
			parsedLimit < 1 ||
			parsedLimit > 100 ||
			parsedPage < 1
		) {
			return resp.status(400).json({
				message:
					"Limit must be 1-100 and page must be a positive integer",
			});
		}

		const offset = (parsedPage - 1) * parsedLimit;

		const tables = await Table.findAll({
			limit: parsedLimit,
			offset: offset,
			order: [["createdAt", "DESC"]],
		});

		resp.status(200).json(tables);
	} catch (error) {
		return resp.status(500).json({
			message: "Internal server error",
		});
	}
});

router.get("/:id", async (req, resp) => {
	try {
		const { id } = req.params;

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			return resp.status(400).json({
				message: "Invalid table ID",
			});
		}

		const table = await Table.findByPk(id);

		if (!table) {
			return resp.status(404).json({
				message: "Table not found",
			});
		}
		resp.status(200).json(user);
	} catch (error) {
		return resp.status(500).json({ message: "Internal server error" });
	}
});

router.put("/:id", async (req, resp) => {
	try {
		const { id } = req.params;

		if (
			!req.body ||
			typeof req.body !== "object" ||
			Array.isArray(req.body)
		) {
			return resp.status(400).json({
				message: "Request body must be an object",
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			return resp.status(400).json({
				message: "Invalid table ID",
			});
		}

		const allowedFields = ["tableNumber", "seats", "tableTypeId"];
		const fields = Object.keys(req.body);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			return resp
				.status(400)
				.json({ message: "Invalid or empty request body" });
		}

		const table = await Table.findByPk(id);

		if (!table) {
			return resp.status(404).json({
				message: "Table not found",
			});
		}

		const { tableNumber, seats, tableTypeId } = req.body;

		if (
			tableNumber !== undefined &&
			(!Number.isInteger(tableNumber) || tableNumber < 1)
		) {
			return resp.status(400).json({
				message: "Table number must be a positive integer",
			});
		}

		if (seats !== undefined && (!Number.isInteger(seats) || seats < 1)) {
			return resp.status(400).json({
				message: "Seats must be a positive integer",
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				tableTypeId,
			)
		) {
			return resp.status(400).json({
				message: "Invalid table type ID",
			});
		}

		const tableType = await TableType.findByPk(tableTypeId);

		if (!tableType) {
			return resp.status(404).json({
				message: "Table type not found",
			});
		}

		if (tableNumber !== undefined) {
			const existingTable = await Table.findOne({
				where: { tableNumber },
			});

			if (existingTable) {
				return resp.status(409).json({
					message: "This table number already exists",
				});
			}
		}

		await tableType.update(
			...(tableNumber !== undefined && { tableNumber }),
			...(seats !== undefined && {
				seats,
			}),
			...(tableTypeId !== undefined && { tableTypeId }),
		);

		return resp.status(200).json(table);
	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			return resp.status(409).json({
				message: "This table number already exists",
			});
		}

		// if (error.name === "SequelizeValidationError") {
		// 	return resp.status(400).json({
		// 		message: error.message,
		// 	});
		// }

		return resp.status(500).json({
			message: "Internal server error",
		});
	}
});

router.delete("/:id", async (req, resp) => {
	try {
		const { id } = req.params;

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			return resp.status(400).json({
				message: "Invalid table ID",
			});
		}

		const table = await Table.findByPk(id);

		if (!table) {
			return resp.status(404).json({
				message: "Table not found",
			});
		}

		await table.destroy();

		return resp.status(200).json({
			message: "Table deleted successfully",
		});
	} catch (error) {
		return resp.status(500).json({ message: "Internal server error" });
	}
});
