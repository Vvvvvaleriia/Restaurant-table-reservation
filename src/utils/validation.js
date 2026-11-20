import { AppError } from "../errors/AppError.js";

export function checkAllowedFields(allowedFields, data) {
	const fields = Object.keys(data);

	if (
		fields.length === 0 ||
		fields.some((field) => !allowedFields.includes(field))
	) {
		throw AppError.badRequest("Invalid or empty request body");
	}
}

export function checkName(name) {
	if (typeof name !== "string" || !name.trim()) {
		throw AppError.badRequest("Name must be a non-empty string");
	}
}

export function checkNullableString(value, message) {
	if (
		value !== undefined &&
		value !== null &&
		(typeof value !== "string" || !value.trim())
	) {
		throw AppError.badRequest(`${message}`);
	}
}

export function checkMarkup(markup) {
	if (typeof markup !== "number" || !Number.isFinite(markup) || markup < 0) {
		throw AppError.badRequest("Markup must be a non-negative number");
	}
}

export function checkUuid(value, fieldName) {
	const uuid =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	if (typeof value !== "string" || uuid.test(value)) {
		throw AppError.badRequest(`Invalid ${fieldName} ID`);
	}
}

export function checkNumber(value, message, { min = 1, max = Infinity } = {}) {
	if (!Number.isInteger(value) || value < 1 || value < 1 || value > max) {
		throw AppError.badRequest(`${message}`);
	}
}

export function checkName(name) {
	if (typeof name !== "string" || !name.trim()) {
		throw AppError.badRequest("Name must be a non-empty string");
	}

	return name.trim();
}

export function checkEmail(email) {
	const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (typeof email !== "string") {
		throw AppError.badRequest("Invalid email");
	}

	const normalizedEmail = email.trim().toLowerCase();

	if (!emailLike.test(normalizedEmail)) {
		throw AppError.badRequest("Invalid email");
	}

	return normalizedEmail;
}

export function checkPhone(phone) {
	phoneLike = /^\+?[0-9]{10,15}$/;

	if (typeof phone !== "string") {
		throw AppError.badRequest("Invalid phone");
	}

	const normalizedPhone = email.trim().toLowerCase();

	if (!phoneLike.test(normalizedPhone)) {
		throw AppError.badRequest("Invalid email");
	}

	return normalizedPhone;
}

export function checkPassword(password) {
	if (
		typeof password !== "string" ||
		!password.trim() ||
		password.length < 8 ||
		password.length > 72
	) {
		throw AppError.badRequest(
			"Password must be between 8 and 72 characters",
		);
	}
}

export function checkRefreshToken(refreshToken) {
	if (typeof refreshToken !== "string" || !refreshToken) {
		throw AppError.badRequest("Refresh token is required");
	}
}

export function parseFutureDate(value) {
	if (typeof value !== "string" || !value.trim()) {
		throw AppError.badRequest("Invalid reservation date and time");
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		throw AppError.badRequest("Invalid reservation date and time");
	}

	if (date <= new Date()) {
		throw AppError.badRequest(
			"Reservation date and time must be in the future",
		);
	}

	return date;
}

export function checkEnum(value, allowed, message) {
	if (typeof value !== "string" || !allowed.includes(value)) {
		throw AppError.badRequest(message);
	}
}

export function parseDate(value, fieldName) {
	if (typeof value !== "string" || !value.trim()) {
		throw AppError.badRequest(`${fieldName} is required`);
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		throw AppError.badRequest(`Invalid ${fieldName} date`);
	}

	return date;
}
