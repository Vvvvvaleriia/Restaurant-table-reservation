import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/auth.js";
import UserRepository from "../repositories/user.js";
import { StatusCodes } from "http-status-codes";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export default class AuthService {
	static async register(body) {
		const allowedFields = ["name", "email", "phone", "password"];
		const invalidFields = Object.keys(body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw Object.assign(new Error("Unexpected fields"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const { name, email, phone, password } = body;

		if (!name || !email || !phone || !password) {
			throw Object.assign(new Error("All fields are required"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		if (
			typeof name !== "string" ||
			typeof email !== "string" ||
			typeof phone !== "string" ||
			typeof password !== "string"
		) {
			throw Object.assign(new Error("Invalid field types"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const normalizedName = name.trim();
		const normalizedEmail = email.trim().toLowerCase();
		const normalizedPhone = phone.trim();

		if (
			!normalizedName ||
			!normalizedEmail ||
			!normalizedPhone ||
			!password.trim()
		) {
			throw Object.assign(new Error("Fields cannot be empty"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
			throw Object.assign(new Error("Invalid email"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
			throw Object.assign(new Error("Invalid phone number"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const existingUser = await UserRepository.findByEmail(normalizedEmail);

		if (existingUser) {
			throw Object.assign(new Error("Email already exists"), {
				status: StatusCodes.CONFLICT,
			});
		}

		if (password.length < 8 || password.length > 72) {
			throw Object.assign(
				new Error("Password must be between 8 and 72 characters"),
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const user = await AuthRepository.create({
			name: normalizedName,
			email: normalizedEmail,
			phone: normalizedPhone,
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
		const { email, password } = body;

		if (
			typeof email !== "string" ||
			typeof password !== "string" ||
			!email.trim() ||
			!password
		) {
			throw Object.assign(new Error("Email and password are required"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await UserRepository.findByEmail(normalizedEmail);

		if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
			throw Object.assign(new Error("Invalid email or password"), {
				status: StatusCodes.UNAUTHORIZED,
			});
		}

		const accessToken = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			JWT_ACCESS_SECRET,
			{ expiresIn: "15m" },
		);

		const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: "7d",
		});

		await AuthRepository.updateRefreshToken(user.id, refreshToken);
		return { accessToken, refreshToken };
	}

	static async profile(userId) {
		const user = await AuthRepository.findProfile(userId);

		if (!user) {
			throw Object.assign(new Error("User not found"), {
				status: StatusCodes.NOT_FOUND,
			});
		}
		return user;
	}

	static async refresh(body) {
		const { refreshToken } = body;

		if (typeof refreshToken !== "string" || !refreshToken) {
			throw Object.assign(new Error("Refresh token is required"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		let payload;
		try {
			payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
		} catch {
			throw Object.assign(new Error("Invalid or expired refresh token"), {
				status: StatusCodes.UNAUTHORIZED,
			});
		}

		const user = await AuthRepository.findById(payload.id);

		if (!user || user.refreshToken !== refreshToken) {
			throw Object.assign(new Error("Invalid refresh token"), {
				status: StatusCodes.UNAUTHORIZED,
			});
		}

		const accessToken = jwt.sign(
			{ id: user.id, role: user.role },
			JWT_ACCESS_SECRET,
			{
				expiresIn: "15m",
			},
		);

		const newRefreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: "7d",
		});

		await AuthRepository.updateRefreshToken(user.id, newRefreshToken);

		return {
			accessToken,
			refreshToken: newRefreshToken,
		};
	}

	static async logout(body) {
		const { refreshToken } = body;

		if (typeof refreshToken !== "string" || !refreshToken) {
			throw Object.assign(new Error("Refresh token is required"), {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		const user = await AuthRepository.findByRefreshToken(refreshToken);

		if (user) {
			await AuthRepository.updateRefreshToken(user.id, null);
		}

		return { message: "Logged out successfully" };
	}
}
