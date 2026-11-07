const UUID =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function chechUuidMiddleware(req, resp, next) {
	const { id } = req.params;

	if (!UUID.test(id)) {
		return resp.status(400).json({
			massage: "Invalid UUID",
		});
	}

	next();
}
