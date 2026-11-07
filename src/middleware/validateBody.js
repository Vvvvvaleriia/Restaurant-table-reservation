export default function validateBodyMiddleware(req, resp, next) {
	if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
		return resp.status(400).json({
			error: "Request body must be an object",
		});
	}

	next();
}
