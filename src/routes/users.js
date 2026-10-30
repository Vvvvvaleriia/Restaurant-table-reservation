import { Router } from "express";
import { TableType, User } from "../models/index.js";
import bcrypt from "bcrypt";

export const router = Router();

router.get("/", async (req, resp) => {
	const { limit = "10", page = "1" } = req.query;

	try {
		const parsedLimit = Number(limit);
		const parsedPage = Number(page);

		// перевірка на ціле число
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

		const users = await User.findAll({
			limit: parsedLimit,
			offset: offset,
			order: [["createdAt", "DESC"]],
			attributes: {
				exclude: ["passwordHash"],
			},
		});

		resp.status(200).json(users);
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

		const user = await User.findByPk(id, {
			attributes: {
				exclude: ["passwordHash"],
			},
		});

		if (!user) {
			return resp.status(404).json({
				message: "User not found",
			});
		}
		resp.status(200).json(user);
	} catch (error) {
		return resp.status(500).json({ message: "Internal server error" });
	}
});

router.put("/:id", async (req, resp) => {
	try {
		const { id } = req.params;
		const { name, email, phone } = req.body;

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
				message: "Invalid user ID",
			});
		}

		const allowedFields = ["name", "email", "phone"];
		const fields = Object.keys(req.body);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			return resp
				.status(400)
				.json({ message: "Invalid or empty request body" });
		}

		if (name !== undefined) {
			if (typeof name !== "string" || !name.trim()) {
				return resp.status(400).json({
					message: "Invalid name",
				});
			}
		}

		const normalizedEmail = email.trim().toLowerCase();

		if (email !== undefined) {
			if (
				typeof email !== "string" ||
				!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
			) {
				return resp.status(400).json({
					message: "Invalid email",
				});
			}
		}

		if (phone !== undefined) {
			if (typeof phone !== "string" || !/^\+?[0-9]{10,15}$/.test(phone)) {
				return resp.status(400).json({
					message: "Invalid phone number",
				});
			}
		}

		const user = await User.findByPk(id);

		if (!user) {
			return resp.status(404).json({
				message: "User not found",
			});
		}

		await user.update({
			...(name !== undefined && { name: name.trim() }),
			...(email !== undefined && { email: normalizedEmail }),
			...(phone !== undefined && { phone: phone.trim() }),
		});

		resp.status(200).json({
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
		});
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

		const user = await User.findByPk(id);

		if (!user) {
			return resp.status(404).json({
				message: "User not found",
			});
		}

		await user.destroy();
		return resp.status(200).json({
			message: "User deleted successfully",
		});
	} catch (error) {
		return resp.status(500).json({ message: "Internal server error" });
	}
});
