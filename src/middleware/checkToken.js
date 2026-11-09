import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export default function authMiddleware(req, resp, next) {
	const authorization = req.headers.authorization;

	if (!authorization || !authorization.startsWith("Bearer ")) {
		throw Object.assign(new Error("Access token is required"), {
			status: 401,
		});
	}

	const accessToken = authorization.split(" ")[1];

	try {
		const payload = jwt.verify(accessToken, JWT_ACCESS_SECRET);

		req.user = { id: payload.id, role: payload.role };

		next();
	} catch (error) {
		return resp.status(401).json({
			error:
				error.name === "TokenExpiredError"
					? "Access token expired"
					: "Invalid access token",
		});
	}
}
