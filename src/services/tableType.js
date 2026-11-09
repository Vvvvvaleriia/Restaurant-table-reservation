import TableTypeRepository from "../repositories/tableType.js";

export default class TableTypeService {
	static async create(data) {
		const allowedFields = ["name", "description", "markup"];
		const invalidFields = Object.keys(data).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw Object.assign(new Error("Request contains invalid fields"), {
				status: 400,
			});
		}

		const { name, description, markup } = data;

		if (name === undefined || markup === undefined) {
			throw Object.assign(new Error("Name and markup are required"), {
				status: 400,
			});
		}

		if (typeof name !== "string" || !name.trim()) {
			throw Object.assign(new Error("Name must be a non-empty string"), {
				status: 400,
			});
		}

		if (
			typeof markup !== "number" ||
			!Number.isFinite(markup) ||
			markup < 0
		) {
			throw Object.assign(
				new Error("Markup must be a non-negative number"),
				{
					status: 400,
				},
			);
		}

		if (
			description !== undefined &&
			description !== null &&
			(typeof description !== "string" || !description.trim())
		) {
			throw Object.assign(new Error("Description must be a string"), {
				status: 400,
			});
		}

		const existingType = await TableTypeRepository.findByName(name.trim());

		if (existingType) {
			throw Object.assign(
				new Error("Table type with this name already exists"),
				{ status: 409 },
			);
		}

		return await TableTypeRepository.create({
			name: name.trim(),
			description: description?.trim() || null,
			markup,
		});
	}

	static async getAll(limit, page) {
		console.log("PAGINATION:", { limit, page });

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
			throw Object.assign(new Error("Table type not found"), {
				status: 404,
			});
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
			throw Object.assign(new Error("Invalid or empty request body"), {
				status: 400,
			});
		}

		const { name, description, markup } = data;

		if (name !== undefined && (typeof name !== "string" || !name.trim())) {
			throw Object.assign(new Error("Name must be a non-empty string"), {
				status: 400,
			});
		}

		if (
			markup !== undefined &&
			(typeof markup !== "number" ||
				!Number.isFinite(markup) ||
				markup < 0)
		) {
			throw Object.assign(
				new Error("Markup must be a non-negative number"),
				{
					status: 400,
				},
			);
		}

		if (
			description !== undefined &&
			description !== null &&
			(typeof description !== "string" || !description.trim())
		) {
			throw Object.assign(new Error("Description must be a string"), {
				status: 400,
			});
		}

		const tableType = await TableTypeRepository.findById(id);

		if (!tableType) {
			throw Object.assign(new Error("Table type not found"), {
				status: 404,
			});
		}

		if (name !== undefined) {
			const existingType = await TableTypeRepository.findByName(
				name.trim(),
			);

			if (existingType && existingType.id !== tableType.id) {
				throw Object.assign(
					new Error("Table type with this name already exists"),
					{ status: 409 },
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
			throw Object.assign(new Error("Table type not found"), {
				status: 404,
			});
		}

		return await TableTypeRepository.delete(tableType);
	}
}
