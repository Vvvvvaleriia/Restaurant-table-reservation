import TableTypeRepository from "../repositories/tableType.js";
import { AppError } from "../errrors/AppError.js";

export default class TableTypeService {
	static async create(data) {
		const allowedFields = ["name", "description", "markup"];
		const invalidFields = Object.keys(data).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw new AppError.badRequest("Request contains invalid fields");
		}

		const { name, description, markup } = data;

		if (name === undefined || markup === undefined) {
			throw new AppError.badRequest("Name and markup are required");
		}

		if (typeof name !== "string" || !name.trim()) {
			throw new AppError.badRequest("Name must be a non-empty string");
		}

		if (
			typeof markup !== "number" ||
			!Number.isFinite(markup) ||
			markup < 0
		) {
			throw new AppError.badRequest(
				"Markup must be a non-negative number",
			);
		}

		if (
			description !== undefined &&
			description !== null &&
			(typeof description !== "string" || !description.trim())
		) {
			throw new AppError.badRequest("Description must be a string");
		}

		const existingType = await TableTypeRepository.findByName(name.trim());

		if (existingType) {
			throw new AppError.conflict(
				"Table type with this name already exists",
			);
		}

		return await TableTypeRepository.create({
			name: name.trim(),
			description: description?.trim() || null,
			markup,
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
			throw new AppError.badRequest(
				"Limit must be 1-100 and page must be a positive integer",
			);
		}

		const offset = (parsedPage - 1) * parsedLimit;

		const { count, rows } = await TableTypeRepository.findAll({
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
		const tableType = await TableTypeRepository.findById(id);

		if (!tableType) {
			throw new AppError.notFound("Table type not found");
		}

		return tableType;
	}

	static async update(id, data) {
		const allowedFields = ["name", "description", "markup"];
		const fields = Object.keys(data);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			throw new AppError.badRequest("Invalid or empty request body");
		}

		const { name, description, markup } = data;

		if (name !== undefined && (typeof name !== "string" || !name.trim())) {
			throw new AppError.badRequest("Name must be a non-empty string");
		}

		if (
			markup !== undefined &&
			(typeof markup !== "number" ||
				!Number.isFinite(markup) ||
				markup < 0)
		) {
			throw new AppError.badRequest(
				"Markup must be a non-negative number",
			);
		}

		if (
			description !== undefined &&
			description !== null &&
			(typeof description !== "string" || !description.trim())
		) {
			throw new AppError.badRequest("Description must be a string");
		}

		const tableType = await TableTypeRepository.findById(id);

		if (!tableType) {
			throw new AppError.notFound("Table type not found");
		}

		if (name !== undefined) {
			const existingType = await TableTypeRepository.findByName(
				name.trim(),
			);

			if (existingType && existingType.id !== tableType.id) {
				throw new AppError.conflict(
					"Table type with this name already exists",
				);
			}
		}

		await TableTypeRepository.update(tableType, {
			...(name !== undefined && { name: name.trim() }),
			...(description !== undefined && {
				description: description?.trim() || null,
			}),
			...(markup !== undefined && { markup }),
		});

		return tableType;
	}

	static async delete(id) {
		const tableType = await TableTypeRepository.findById(id);

		if (!tableType) {
			throw new AppError.notFound("Table type not found");
		}

		return await TableTypeRepository.delete(tableType);
	}
}
