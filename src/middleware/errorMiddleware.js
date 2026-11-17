export default function errorMiddleware(err, req, resp, next) {
	console.error(err);
	const statusCode = err.status || 500;

	resp.status(statusCode).json({
		status: err.status || "error",
		message: err.status ? err.message : "Internal Server Error",
	});
}
