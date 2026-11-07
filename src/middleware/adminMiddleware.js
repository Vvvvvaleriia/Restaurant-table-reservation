export default function adminMiddleware(req, resp, next) {
	if (req.user.role !== "admin") {
		return resp.statuc(403).json({
			message: "Access denied. Admin only",
		});
	}

	next();
}
