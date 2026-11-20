import TableTypeRepository from "../repositories/tableType.js";
import { AppError } from "../errors/AppError.js";
import { parsePagination, paginatedResponse } from "../utils/pagination.js";
import {
	checkAllowedFields,
	checkMarkup,
	checkName,
	checkNullableString,
} from "../utils/validation.js";
import { tableTypeExists, tableTypeNameExists } from "../utils/exists.js";

export default class TableTypeService {
	static async create(data) {
		const allowedFields = ["name", "description", "markup"];
		checkAllowedFields(allowedFields, data);

		const { name, description, markup } = data;

		if (name === undefined || markup === undefined) {
			throw AppError.badRequest("Name and markup are required");
		}

		const normalizedName = checkName(name);
		checkMarkup(markup);
		checkNullableString(description, "Description must be a string");

		await tableTypeNameExists(name.trim());

		return await TableTypeRepository.create({
			name: normalizedName,
			description: description?.trim() ?? null,
			markup,
		});
	}

	static async getAll(limit, page) {
		const parsedLimit = Number(limit);
		const parsedPage = Number(page);

		const { offset } = parsePagination(parsedLimit, parsedPage);

		const { count, rows } = await TableTypeRepository.findAll({
			limit: parsedLimit,
			offset,
		});

		return paginatedResponse(count, rows, parsedLimit, parsedPage);
	}

	static async getById(id) {
		return await tableTypeExists(id);
	}

	static async update(id, data) {
		const allowedFields = ["name", "description", "markup"];
		checkAllowedFields(allowedFields, data);

		const { name, description, markup } = data;

		const tableType = await tableTypeExists(id);

		const changes = {};

		if (name !== undefined) {
			changes.name = checkName(name);

			if (changes.name !== tableType.name) {
				await tableTypeNameExists(changes.name);
			}
		}

		if (description !== undefined) {
			checkNullableString(description, "Description must be a string");
			changes.description = description?.trim() ?? null;
		}

		if (markup !== undefined) {
			checkMarkup(markup);
			changes.markup = markup;
		}

		await TableTypeRepository.update(tableType, changes);

		return tableType;
	}

	static async delete(id) {
		const tableType = await tableTypeExists(id);

		return await TableTypeRepository.delete(tableType);
	}
}
