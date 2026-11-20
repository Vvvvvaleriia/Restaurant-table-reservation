import { AppError } from "../errors/AppError.js";

export function checkOwnerOrAdmin(ownerId, userId, role) {
	if (ownerId !== userId && role !== "admin") {
		throw AppError.forbidden("Access denied");
	}
}
