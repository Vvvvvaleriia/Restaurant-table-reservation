import UserRepository from "../repositories/user.js";

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
				{ status: 400 },
			);
		}

		const offset = (parsedPage - 1) * parsedLimit;

		return await UserRepository.findAll({
			limit: parsedLimit,
			offset,
		});
	}

	static async getById(userId, role, id) {
		const user = await UserRepository.findById(id);

		if (!user) {
			throw Object.assign(new Error("User not found"), {
				status: 404,
			});
		}

		if (user.id !== userId && role !== "admin") {
			throw Object.assign(new Error("Access denied"), {
				status: 403,
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
				status: 400,
			});
		}

		const user = await UserRepository.findById(id);

		if (!user) {
			throw Object.assign(new Error("User not found"), {
				status: 404,
			});
		}

		if (user.id !== userId && role !== "admin") {
			throw Object.assign(new Error("Access denied"), {
				status: 403,
			});
		}

		if (name !== undefined) {
			if (typeof name !== "string" || !name.trim()) {
				throw Object.assign(new Error("Invalid name"), {
					status: 400,
				});
			}
		}

		let normalizedEmail;
		if (email !== undefined) {
			if (typeof email !== "string") {
				throw Object.assign(new Error("Invalid email"), {
					status: 400,
				});
			}

			normalizedEmail = email.trim().toLowerCase();

			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
				throw Object.assign(new Error("Invalid email"), {
					status: 400,
				});
			}
		}

		if (email !== undefined) {
			const existingUser =
				await UserRepository.findByEmail(normalizedEmail);

			if (existingUser && existingUser.id !== user.id) {
				throw Object.assign(new Error("Email already exists"), {
					status: 409,
				});
			}
		}

		if (phone !== undefined) {
			if (
				typeof phone !== "string" ||
				!/^\+?[0-9]{10,15}$/.test(phone.trim())
			) {
				throw Object.assign(new Error("Invalid phone number"), {
					status: 400,
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
				status: 404,
			});
		}

		if (user.id !== userId && role !== "admin") {
			throw Object.assign(new Error("Access denied"), {
				status: 403,
			});
		}

		return await UserRepository.delete(user);
	}
}
