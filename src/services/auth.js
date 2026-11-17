import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/auth.js";
import UserRepository from "../repositories/user.js";
import { AppError } from "../errrors/AppError.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export default class AuthService {
	static async register(body) {
		const allowedFields = ["name", "email", "phone", "password"];
		const invalidFields = Object.keys(body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			throw AppError.badRequest("Unexpected fields");
		}

		const { name, email, phone, password } = body;

		if (!name || !email || !phone || !password) {
			throw AppError.badRequest("All fields are required");
		}

		if (
			typeof name !== "string" ||
			typeof email !== "string" ||
			typeof phone !== "string" ||
			typeof password !== "string"
		) {
			throw AppError.badRequest("Invalid field types");
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
			throw AppError.badRequest("Fields cannot be empty");
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
			throw AppError.badRequest("Invalid email");
		}

		if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
			throw AppError.badRequest("Invalid phone number");
		}

		const existingUser = await UserRepository.findByEmail(normalizedEmail);

		if (existingUser) {
			throw AppError.conflict("Email already exists");
		}

		if (password.length < 8 || password.length > 72) {
			throw AppError.badRequest(
				"Password must be between 8 and 72 characters",
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
			throw AppError.badRequest("Email and password are required");
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await UserRepository.findByEmail(normalizedEmail);

		if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
			throw AppError.unauthorized("Invalid email or password");
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
			throw AppError.notFound("User not found");
		}
		return user;
	}

	static async refresh(body) {
		const { refreshToken } = body;

		if (typeof refreshToken !== "string" || !refreshToken) {
			throw AppError.badRequest("Refresh token is required");
		}

		let payload;
		try {
			payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
		} catch {
			throw AppError.unauthorized("Invalid or expired refresh token");
		}

		const user = await AuthRepository.findById(payload.id);

		if (!user || user.refreshToken !== refreshToken) {
			throw AppError.unauthorized("Invalid refresh token");
		}

		const accessToken = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
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
			throw AppError.badRequest("Refresh token is required");
		}

		const user = await AuthRepository.findByRefreshToken(refreshToken);

		if (user) {
			await AuthRepository.updateRefreshToken(user.id, null);
		}

		return { message: "Logged out successfully" };
	}
}
