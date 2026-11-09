import UserRepository from "../repositories/user.js";
import { StatusCodes } from "http-status-codes";

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
			throw Object.assign(
				new Error(
					"Limit must be 1-100 and page must be a positive integer",
				),
				{ status: StatusCodes.BAD_REQUEST },
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
			throw Object.assign(new Error("User not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		if (user.id !== userId && role !== "admin") {
			throw Object.assign(new Error("Access denied"), {
				status: StatusCodes.FORBIDDEN,
			});
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
			throw Object.assign(new Error("Invalid or empty request body"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const user = await UserRepository.findById(id);

		if (!user) {
			throw Object.assign(new Error("User not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		if (user.id !== userId && role !== "admin") {
			throw Object.assign(new Error("Access denied"), {
				status: StatusCodes.FORBIDDEN,
			});
		}

		if (name !== undefined) {
			if (typeof name !== "string" || !name.trim()) {
				throw Object.assign(new Error("Invalid name"), {
					status: StatusCodes.BAD_REQUEST,
				});
			}
		}

		let normalizedEmail;
		if (email !== undefined) {
			if (typeof email !== "string") {
				throw Object.assign(new Error("Invalid email"), {
					status: StatusCodes.BAD_REQUEST,
				});
			}

			normalizedEmail = email.trim().toLowerCase();

			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
				throw Object.assign(new Error("Invalid email"), {
					status: StatusCodes.BAD_REQUEST,
				});
			}
		}

		if (email !== undefined) {
			const existingUser =
				await UserRepository.findByEmail(normalizedEmail);

			if (existingUser && existingUser.id !== user.id) {
				throw Object.assign(new Error("Email already exists"), {
					status: StatusCodes.CONFLICT,
				});
			}
		}

		if (phone !== undefined) {
			if (
				typeof phone !== "string" ||
				!/^\+?[0-9]{10,15}$/.test(phone.trim())
			) {
				throw Object.assign(new Error("Invalid phone number"), {
					status: StatusCodes.BAD_REQUEST,
				});
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
			throw Object.assign(new Error("User not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}

		if (user.id !== userId && role !== "admin") {
			throw Object.assign(new Error("Access denied"), {
				status: StatusCodes.FORBIDDEN,
			});
		}

		return await UserRepository.delete(user);
	}
}
