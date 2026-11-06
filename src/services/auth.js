import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/auth.js";
import UserRepository from "../repositories/user.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export default class AuthService {
	static async register(body) {
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			throw Object.assign(new Error("Invalid request body"), {
				status: 400,
			});
		}

		const allowedFields = ["name", "email", "phone", "password"];
		const invalidFields = Object.keys(req.body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw Object.assign(new Error("Unexpected fields"), {
				status: 400,
			});
		}

		const { name, email, phone, password } = body;

		if (!name || !email || !phone || !password) {
			throw Object.assign(new Error("All fields are required"), {
				status: 400,
			});
		}

		if (
			typeof name !== "string" ||
			typeof email !== "string" ||
			typeof phone !== "string" ||
			typeof password !== "string"
		) {
			throw Object.assign(new Error("Invalid field types"), {
				status: 400,
			});
		}

		const normalizedName = name.trim();
		const normalizedEmail = email.trim().toLowerCase();
		const normalizedPhone = phone.trim();

		if (
			!normalizedName ||
			!normalizedEmail ||
			!normalizedPhone ||
			!password()
		) {
			throw Object.assign(new Error("Fields cannot be empty"), {
				status: 400,
			});
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
			throw Object.assign(new Error("Invalid email"), {
				status: 400,
			});
		}

		if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
			throw Object.assign(new Error("Invalid phone number"), {
				status: 400,
			});
		}

		const existingUser = await UserRepository.findByEMail({
			normalizedEmail,
		});

		if (existingUser) {
			throw Object.assign(new Error("Email already exists"), {
				status: 409,
			});
		}

		// if (password.length < 8 || password.length > 72) {
		// 	return resp.status(400).json({
		// 		message: "Password must be between 8 and 72 characters",
		// 	});
		// }

		const passwordHash = await bcrypt.hash(password, 10);

		const user = await AuthRepository.create({
			name: name.trim(),
			email: normalizedEmail,
			phone: phone.trim(),
			passwordHash,
		});

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
		};
	}

	static async login(body) {
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			throw Object.assign(new Error("Invalid request body"), {
				status: 400,
			});
		}

		const { email, password } = body;

		if (
			typeof email !== "string" ||
			typeof password !== "string" ||
			!email.trim() ||
			!password
		) {
			throw Object.assign(new Error("Email and password are required"), {
				status: 400,
			});
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await UserRepository.findByEMail({ normalizedEmail });

		if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
			return resp.status(401).json({
				message: "Invalid email or password",
			});
		}

		const accessToken = jwt.sign(
			{ id: user.id, email: user.email },
			JWT_ACCESS_SECRET,
			{ expiresIn: "15m" },
		);

		const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: "7d",
		});

		await AuthRepository.updataRefreshToken(user.id, refreshToken);
		return { accessToken, refreshToken };
	}

	static async profile(userId) {
		const user = await AuthRepository.findProfile(userId);

		if (!user) {
			throw Object.assign(new Error("User not found"), {
				status: 404,
			});
		}
		return user;
	}

	static async refresh(body) {
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			throw Object.assign(new Error("Invalid request body"), {
				status: 400,
			});
		}

		const { refreshToken } = body;

		if (typeof refreshToken !== "string" || !refreshToken) {
			throw Object.assign(new Error("Refresh token is required"), {
				status: 400,
			});
		}

		try {
			const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

			const user = await AuthRepository.findById(payload.id);

			if (!user || user.refreshToken !== refreshToken) {
				throw Object.assign(new Error("Invalid refresh token"), {
					status: 401,
				});
			}

			const accessToken = jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, {
				expiresIn: "15m",
			});

			const newRefreshToken = jwt.sign(
				{ id: user.id },
				JWT_REFRESH_SECRET,
				{ expiresIn: "7d" },
			);

			await AuthRepository.updataRefreshToken(user.id, newRefreshToken);

			return {
				accessToken,
				refreshToken: newRefreshToken,
			};
		} catch (error) {
			if (error.status) {
				throw error;
			}

			throw Object.assign(new Error("Invalid or expired refresh token"), {
				status: 401,
			});
		}
	}

	static async logout(body) {
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			throw Object.assign(new Error("Invalid request body"), {
				status: 400,
			});
		}

		const { refreshToken } = body;

		if (typeof refreshToken !== "string" || !refreshToken) {
			throw Object.assign(new Error("Refresh token is required"), {
				status: 400,
			});
		}

		const user = await AuthRepository.findByRefreshToken(refreshToken);

		if (user) {
			await AuthRepository.updataRefreshToken(user.id, null);
		}

		return { message: "Logged out successfuly" };
	}
}
