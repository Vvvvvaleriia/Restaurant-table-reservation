import { Router } from "express";
import { TableType } from "../models";

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

		const allowedFields = ["name", "description", "markup"];
		const invalidFields = Object.keys(req.body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			return resp.status(400).json({
				message: "Request contains invalid fields",
			});
		}

		const { name, description, markup } = req.body;

		if (name === undefined || markup === undefined) {
			return resp.status(400).json({
				message: "Name and markup are required",
			});
		}

		if (typeof name !== "string" || !name.trim()) {
			return resp.status(400).json({
				message: "Name must be a non-empty string",
			});
		}

		if (
			typeof markup !== "number" &&
			(!Number.isFinite(markup) || markup < 0)
		) {
			return resp.status(400).json({
				message: "Markup must be a non-negative number",
			});
		}

		if (
			description !== undefined &&
			description !== null &&
			(typeof description !== "string" || !description.trim())
		) {
			return resp.status(400).json({
				message: "Description must be a string",
			});
		}

		const existingType = await TableType.findOne({
			where: {
				name: name.trim(),
			},
		});

		if (existingType) {
			return resp.status(409).json({
				message: "Table type with this name already exists",
			});
		}

		const tableType = await TableType.create({
			name: name.trim(),
			description: description?.trim() || null,
			markup,
		});

		return resp.status(201).json(tableType);
	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			return resp.status(409).json({
				message: "Table type with this name already exists",
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
	const { limit = "3", page = "1" } = req.query;

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

		const tableTypes = await TableType.findAll({
			limit: parsedLimit,
			offset: offset,
			order: [["createdAt", "DESC"]],
		});

		resp.status(200).json(tableTypes);
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
				message: "Invalid user ID",
			});
		}

		const tableType = await TableType.findByPk(id);

		if (!tableType) {
			return resp.status(404).json({
				message: "Table type not found",
			});
		}
		resp.status(200).json(tableType);
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
				message: "Invalid table type ID",
			});
		}

		const allowedFields = ["name", "description", "markup"];
		const fields = Object.keys(req.body);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			return resp
				.status(400)
				.json({ message: "Invalid or empty request body" });
		}

		const tableType = await TableType.findByPk(id);

		if (!tableType) {
			return resp.status(404).json({
				message: "Table type not found",
			});
		}

		const { name, description, markup } = req.body;

		if (name !== undefined && (typeof name !== "string" || !name.trim())) {
			return resp.status(400).json({
				message: "Name must be a non-empty string",
			});
		}

		if (
			markup !== undefined &&
			(typeof markup !== "number" ||
				!Number.isFinite(markup) ||
				markup < 0)
		) {
			return resp.status(400).json({
				message: "Markup must be a non-negative number",
			});
		}

		if (
			(description !== undefined &&
				description !== null &&
				typeof description !== "string") ||
			!description.trim()
		) {
			return resp.status(400).json({
				message: "Description must be a string",
			});
		}

		if (name !== undefined) {
			const existingType = await TableType.findOne({
				where: { name: name.trim() },
			});

			if (existingType) {
				return resp.status(409).json({
					message: "Table type with this name already exists",
				});
			}
		}

		await tableType.update(
			...(name !== undefined && { name: name.trim() }),
			...(description !== undefined && {
				description: description?.trim(),
			}),
			...(markup !== undefined && { markup: markup }),
		);

		return resp.status(200).json(tableType);
	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			return resp.status(409).json({
				message: "Email already exists",
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
				message: "Invalid user ID",
			});
		}

		const tableType = await TableType.findByPk(id);

		if (!tableType) {
			return resp.status(404).json({
				message: "Table type not found",
			});
		}

		await tableType.destroy();

		return resp.status(200).json({
			message: "Table type deleted successfully",
		});
	} catch (error) {
		return resp.status(500).json({ message: "Internal server error" });
	}
});
