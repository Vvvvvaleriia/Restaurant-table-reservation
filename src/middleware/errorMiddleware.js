export default function errorMiddleware(err, req, resp, next) {
	const statusCode = err.statusCode || 500;

	resp.status(statusCode).json({
		status: err.status || "error",
		message: err.isOperational ? err.message : "Internal Server Error",
	});
}
