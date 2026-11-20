import { AppError } from "../errors/AppError.js";

export function parsePagination(limit, page) {
	if (
		!Number.isInteger(limit) ||
		!Number.isInteger(page) ||
		limit < 1 ||
		limit > 100 ||
		page < 1
	) {
		throw AppError.badRequest(
			"Limit must be 1-100 and page must be a positive integer",
		);
	}

	const offset = (page - 1) * limit;

	return { offset };
}

export function paginatedResponse(count, rows, limit, page) {
	return {
		data: rows,
		pagination: {
			totalItems: count,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
			limit: limit,
		},
	};
}
