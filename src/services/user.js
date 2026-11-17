import UserRepository from "../repositories/user.js";
import { AppError } from "../errrors/AppError.js";

export default class UserService {
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
			throw AppError.badRequest(
				"Limit must be 1-100 and page must be a positive integer",
			);
		}

		const offset = (parsedPage - 1) * parsedLimit;

		const { count, rows } = await UserRepository.findAll({
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

	static async getById(userId, role, id) {
		const user = await UserRepository.findById(id);

		if (!user) {
			throw AppError.notFound("User not found");
		}

		if (user.id !== userId && role !== "admin") {
			throw AppError.forbidden("Access denied");
		}

		return user;
	}

	static async update(userId, role, id, data) {
		const { name, email, phone } = data;

		const allowedFields = ["name", "email", "phone"];
		const fields = Object.keys(data);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			throw AppError.badRequest("Invalid or empty request body");
		}

		const user = await UserRepository.findById(id);

		if (!user) {
			throw AppError.notFound("User not found");
		}

		if (user.id !== userId && role !== "admin") {
			throw AppError.forbidden("Access denied");
		}

		if (name !== undefined) {
			if (typeof name !== "string" || !name.trim()) {
				throw AppError.badRequest("Invalid name");
			}
		}

		let normalizedEmail;
		if (email !== undefined) {
			if (typeof email !== "string") {
				throw AppError.badRequest("Invalid email");
			}

			normalizedEmail = email.trim().toLowerCase();

			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
				throw AppError.badRequest("Invalid email");
			}
		}

		if (email !== undefined) {
			const existingUser =
				await UserRepository.findByEmail(normalizedEmail);

			if (existingUser && existingUser.id !== user.id) {
				throw AppError.conflict("Email already exists");
			}
		}

		if (phone !== undefined) {
			if (
				typeof phone !== "string" ||
				!/^\+?[0-9]{10,15}$/.test(phone.trim())
			) {
				throw AppError.badRequest("Invalid phone number");
			}
		}

		await UserRepository.update(user, {
			...(name !== undefined && { name: name.trim() }),
			...(email !== undefined && { email: normalizedEmail }),
			...(phone !== undefined && { phone: phone.trim() }),
		});

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
		};
	}

	static async delete(userId, role, id) {
		const user = await UserRepository.findById(id);

		if (!user) {
			throw AppError.notFound("User not found");
		}

		if (user.id !== userId && role !== "admin") {
			throw AppError.forbidden("Access denied");
		}

		return await UserRepository.delete(user);
	}
}
