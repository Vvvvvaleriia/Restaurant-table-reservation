import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const router = Router();

router.post("/register", async (req, resp) => {
	try {
		// перевірка наявності і типу req.body
		if (
			!req.body ||
			typeof req.body !== "object" ||
			Array.isArray(req.body)
		) {
			return resp.status(400).json({
				message: "Request body must be an object",
			});
		}

		// перевірка на зайві поля
		const allowedFields = ["name", "email", "phone", "password"];
		const invalidFields = Object.keys(req.body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			return resp.status(400).json({
				message: "Request contains invalid fields",
			});
		}

		const { name, email, phone, password } = req.body;

		if (!name || !email || !phone || !password) {
			return resp.status(400).json({
				message: "Name, email, phone and password are required",
			});
		}

		// перевірка на тип даних
		if (
			typeof name !== "string" ||
			typeof email !== "string" ||
			typeof phone !== "string" ||
			typeof password !== "string"
		) {
			return resp.status(400).json({
				message: "Name, email, phone and password must be strings",
			});
		}

		// перевірка на порожні рядки
		if (
			!name.trim() ||
			!email.trim() ||
			!phone.trim() ||
			!password.trim()
		) {
			return resp.status(400).json({
				message: "Fields must not be empty or contain only spaces",
			});
		}

		const normalizedEmail = email.trim().toLowerCase();

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
			return resp.status(400).json({
				message: "Incorrect email",
			});
		}

		if (!/^\+?[0-9]{10,15}$/.test(phone.trim())) {
			return resp.status(400).json({
				message: "Incorrect phone number",
			});
		}

		const existingUser = await User.findOne({
			where: { email: normalizedEmail },
		});

		if (existingUser) {
			return resp.status(409).json({
				message: "Email already exists",
			});
		}

		// if (password.length < 8 || password.length > 72) {
		// 	return resp.status(400).json({
		// 		message: "Password must be between 8 and 72 characters",
		// 	});
		// }

		const passwordHash = await bcrypt.hash(password, 10);

		const user = await User.create({
			name: name.trim(),
			email: normalizedEmail,
			phone: phone.trim(),
			passwordHash: passwordHash,
		});

		resp.status(201).json({
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

router.post("/login", async (req, resp) => {
	const { email, password } = req.body;

	if (
		typeof email !== "string" ||
		typeof password !== "string" ||
		!email.trim() ||
		!password
	) {
		return resp.status(400).json({
			message: "Email and password are required",
		});
	}

	const normalizedEmail = email.trim().toLowerCase();

	const user = await User.findOne({
		where: { email },
	});

	if (!user) {
		return resp.status(401).json({
			message: "Invalid email or password",
		});
	}

	const isMatch = await bcrypt.compare(password, user.passwordHash);

	if (!isMatch) {
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

	user.refreshToken = refreshToken;
	await user.save();
	resp.json({
		accessToken,
		refreshToken,
	});
});

router.get("/profile", async (req, resp) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return resp.status(401).json({
			message: "No token",
		});
	}

	const [type, token] = authHeader.split(" ");

	if (type !== "Bearer" || !token) {
		return resp.status(401).json({
			message: "Invalid token format",
		});
	}

	let payload;
	try {
		payload = jwt.verify(token, JWT_ACCESS_SECRET);
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return resp.status(401).json({
				message: "The token has expired",
			});
		}
		return resp.status(401).json({
			message: "Invalid token",
		});
	}

	const user = await User.findByPk(payload.id, {
		attributes: ["id", "email", "name", "createdAt"],
	});

	if (!user) {
		return resp.status(401).json({
			message: "User not found",
		});
	}

	resp.json(user);
});

router.post("/refresh", async (req, resp) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return resp.status(401).json({
			message: "No refresh token",
		});
	}

	let payload;
	try {
		payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
	} catch (error) {
		return resp.status(401).json({
			message: "Refresh token is invalid",
		});
	}

	const user = await User.findByPk(payload.id);
	if (!user || user.refreshToken !== refreshToken) {
		return resp.status(401).json({
			message: "The refresh token has been revoked",
		});
	}

	const newAccessToken = jwt.sign(
		{ id: user.id, email: user.email },
		JWT_ACCESS_SECRET,
		{ expiresIn: "15m" },
	);
	const newRefreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
		expiresIn: "7d",
	});

	user.refreshToken = newRefreshToken;
	await user.save();

	resp.json({
		accessToken: newAccessToken,
		refreshToken: newRefreshToken,
	});
});

router.post("/logout", async (req, resp) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return resp.status(400).json({
			message: "Refresh token is required",
		});
	}

	const user = await User.findOne({
		where: { refreshToken },
	});

	if (user) {
		user.refreshToken = null;
		await user.save();
	}

	resp.json({
		message: "You log out",
	});
});
