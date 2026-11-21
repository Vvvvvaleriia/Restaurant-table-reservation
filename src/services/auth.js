import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/auth.js";
import { AppError } from "../errors/AppError.js";
import {
	checkAllowedFields,
	checkEmail,
	checkName,
	checkPassword,
	checkPhone,
	checkRefreshToken,
} from "../utils/validation.js";
import { checkEmailNotTaken, profileExists } from "../utils/exists.js";
import {
	createAccessToken,
	createRefreshToken,
	hashToken,
} from "../utils/token.js";
import UserRepository from "../repositories/user.js";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export default class AuthService {
	static async register(data) {
		const allowedFields = ["name", "email", "phone", "password"];
		checkAllowedFields(allowedFields, data);

		const { name, email, phone, password } = data;

		if (
			name === undefined ||
			email === undefined ||
			phone === undefined ||
			password === undefined
		) {
			throw AppError.badRequest(
				"Name, email, phone and password are required",
			);
		}

		const normalizedName = checkName(name);
		const normalizedEmail = checkEmail(email);
		const normalizedPhone = checkPhone(phone);
		checkPassword(password);

		await checkEmailNotTaken(normalizedEmail);

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
		const allowedFields = ["email", "password"];
		checkAllowedFields(allowedFields, body);

		const { email, password } = body;
		if (
			typeof email !== "string" ||
			typeof password !== "string" ||
			!password
		) {
			throw AppError.badRequest("Email and password are required");
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await UserRepository.findByEmail(normalizedEmail);

		if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
			throw AppError.unauthorized("Invalid email or password");
		}

		const accessToken = createAccessToken(user);
		const refreshToken = createRefreshToken(user);

		await AuthRepository.updateRefreshToken(
			user.id,
			hashToken(refreshToken),
		);
		return { accessToken, refreshToken };
	}

	static async profile(userId) {
		return await profileExists(userId);
	}

	static async refresh(body) {
		const { refreshToken } = body;

		checkRefreshToken(refreshToken);

		let payload;
		try {
			payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
		} catch {
			throw AppError.unauthorized("Invalid or expired refresh token");
		}

		const user = await AuthRepository.findById(payload.id);

		if (!user || user.refreshToken !== hashToken(refreshToken)) {
			throw AppError.unauthorized("Invalid refresh token");
		}

		const accessToken = createAccessToken(user);
		const newRefreshToken = createRefreshToken(user);

		await AuthRepository.updateRefreshToken(
			user.id,
			hashToken(newRefreshToken),
		);

		return {
			accessToken,
			refreshToken: newRefreshToken,
		};
	}

	static async logout(body) {
		const { refreshToken } = body;

		checkRefreshToken(refreshToken);

		const user = await AuthRepository.findByRefreshToken(
			hashToken(refreshToken),
		);

		if (!user) {
			throw AppError.unauthorized("Invalid refresh token");
		}

		await AuthRepository.updateRefreshToken(user.id, null);

		return { message: "Logged out successfully" };
	}
}
