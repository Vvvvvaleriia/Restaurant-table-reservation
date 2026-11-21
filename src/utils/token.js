import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export function createAccessToken(user) {
	return jwt.sign(
		{ id: user.id, email: user.email, role: user.role },
		JWT_ACCESS_SECRET,
		{ expiresIn: "15m" },
	);
}

export function createRefreshToken(user) {
	return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
		expiresIn: "7d",
	});
}

export function hashToken(token) {
	return crypto.createHash("sha256").update(token).digest("hex");
}
