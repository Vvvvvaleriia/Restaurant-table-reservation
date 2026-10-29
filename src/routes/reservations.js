import { Router } from "express";
import { User, Reservation, Table } from "../models";

export const router = Router();

router.post("/", async (req, resp) => {
	try {
		if (
			!req.body ||
			typeof req.body !== "object" ||
			Array.isArray(req.body)
		) {
			return resp.status(400).json({
				message: "Request body must be an object",
			});
		}

		const allowedFields = [
			"reservationDatetime",
			"guests",
			"status",
			"userId",
			"tableId",
		];

		const invalidFields = Object.keys(req.body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			return resp.status(400).json({
				message: "Request contains invalid fields",
			});
		}

		const { reservationDatetime, guests, status, userId, tableId } =
			req.body;

		if (
			reservationDatetime === undefined ||
			guests === undefined ||
			userId === undefined ||
			tableId === undefined
		) {
			return resp.status(400).json({
				message:
					"Reservation datetime, guests, user ID and table ID are required",
			});
		}

		// перетворення дати
		const reservationDate = new Date(reservationDatetime);

		if (
			typeof reservationDatetime !== "string" ||
			!reservationDatetime.trim() ||
			Number.isNaN(reservationDate.getTime())
		) {
			return resp.status(400).json({
				message: "Invalid reservation date and time",
			});
		}

		if (reservationDate <= new Date()) {
			return resp.status(400).json({
				message: "Reservation date and time must be in the future",
			});
		}

		if (!Number.isInteger(guests) || guests < 1) {
			return resp.status(400).json({
				message: "Guests must be a positive integer",
			});
		}

		if (
			status !== undefined &&
			!["active", "cancelled", "completed"].includes(status)
		) {
			return resp.status(400).json({
				message: "Invalid reservation status",
			});
		}

		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		if (typeof userId !== "string" || !uuidRegex.test(userId)) {
			return resp.status(400).json({
				message: "Invalid user ID",
			});
		}

		if (typeof tableId !== "string" || !uuidRegex.test(tableId)) {
			return resp.status(400).json({
				message: "Invalid table ID",
			});
		}

		const user = await User.findByPk(userId);

		if (!user) {
			return resp.status(404).json({
				message: "User not found",
			});
		}

		const table = await Table.findByPk(tableId);

		if (!table) {
			return resp.status(404).json({
				message: "Table not found",
			});
		}

		if (guests > table.seats) {
			return resp.status(400).json({
				message: "Number of guests exceeds table capacity",
			});
		}

		const reservation = await Reservation.create({
			reservationDatetime: reservationDate,
			guests,
			...(status !== undefined && { status }),
			userId,
			tableId,
		});

		return resp.status(201).json(reservation);
	} catch (error) {
		// if (error.name === "SequelizeValidationError") {
		// 	return resp.status(400).json({
		// 		message: error.message,
		// 	});
		// }

		console.error(error);

		return resp.status(500).json({
			message: "Internal server error",
		});
	}
});

router.get("/", async (req, resp) => {
	const { limit = "10", page = "1" } = req.query;

	try {
		const parsedLimit = Number(limit);
		const parsedPage = Number(page);

		if (
			!Number.isInteger(parsedLimit) ||
			!Number.isInteger(parsedPage) ||
			parsedLimit < 1 ||
			parsedLimit > 100 ||
			parsedPage < 1
		) {
			return resp.status(400).json({
				message:
					"Limit must be 1-100 and page must be a positive integer",
			});
		}

		const offset = (parsedPage - 1) * parsedLimit;

		const reservations = await Reservation.findAll({
			limit: parsedLimit,
			offset: offset,
			order: [["createdAt", "DESC"]],
		});

		resp.status(200).json(reservations);
	} catch (error) {
		return resp.status(500).json({
			message: "Internal server error",
		});
	}
});

router.get("/:id", async (req, resp) => {
	try {
		const { id } = req.params;

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			return resp.status(400).json({
				message: "Invalid reservation ID",
			});
		}

		const reservation = await Reservation.findByPk(id);

		if (!reservation) {
			return resp.status(404).json({
				message: "Reservation not found",
			});
		}
		resp.status(200).json(reservation);
	} catch (error) {
		return resp.status(500).json({ message: "Internal server error" });
	}
});

router.put("/:id", async (req, resp) => {
	try {
		const { id } = req.params;

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			return resp.status(400).json({
				message: "Invalid reservation ID",
			});
		}

		if (
			!req.body ||
			typeof req.body !== "object" ||
			Array.isArray(req.body)
		) {
			return resp.status(400).json({
				message: "Request body must be an object",
			});
		}

		const allowedFields = [
			"reservationDatetime",
			"guests",
			"status",
			"userId",
			"tableId",
		];

		const fields = Object.keys(req.body);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			return resp.status(400).json({
				message: "Invalid or empty request body",
			});
		}

		const reservation = await Reservation.findByPk(id);

		if (!reservation) {
			return resp.status(404).json({
				message: "Reservation not found",
			});
		}

		const { reservationDatetime, guests, status, userId, tableId } =
			req.body;

		const reservationDate = new Date(reservationDatetime);

		if (
			typeof reservationDatetime !== "string" ||
			!reservationDatetime.trim() ||
			Number.isNaN(reservationDate.getTime())
		) {
			return resp.status(400).json({
				message: "Invalid reservation date and time",
			});
		}

		if (reservationDate <= new Date()) {
			return resp.status(400).json({
				message: "Reservation date and time must be in the future",
			});
		}

		if (guests !== undefined && (!Number.isInteger(guests) || guests < 1)) {
			return resp.status(400).json({
				message: "Guests must be a positive integer",
			});
		}

		if (
			status !== undefined &&
			!["active", "cancelled", "completed"].includes(status)
		) {
			return resp.status(400).json({
				message: "Invalid reservation status",
			});
		}

		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		if (userId !== undefined) {
			if (typeof userId !== "string" || !uuidRegex.test(userId)) {
				return resp.status(400).json({
					message: "Invalid user ID",
				});
			}

			const user = await User.findByPk(userId);

			if (!user) {
				return resp.status(404).json({
					message: "User not found",
				});
			}
		}

		if (tableId !== undefined) {
			if (typeof tableId !== "string" || !uuidRegex.test(tableId)) {
				return resp.status(400).json({
					message: "Invalid table ID",
				});
			}
		}

		const table = await Table.findByPk(tableId);

		if (!table) {
			return resp.status(404).json({
				message: "Table not found",
			});
		}

		const targetTableId =
			tableId !== undefined ? tableId : reservation.tableId;

		const targetTable = table || (await Table.findByPk(targetTableId));

		if (!targetTable) {
			return resp.status(404).json({
				message: "Table not found",
			});
		}

		const targetGuests = guests !== undefined ? guests : reservation.guests;

		if (targetGuests > targetTable.seats) {
			return resp.status(400).json({
				message: "Number of guests exceeds table capacity",
			});
		}

		await reservation.update({
			...(reservationDatetime !== undefined && {
				reservationDatetime: reservationDate,
			}),
			...(guests !== undefined && { guests }),
			...(status !== undefined && { status }),
			...(userId !== undefined && { userId }),
			...(tableId !== undefined && { tableId }),
		});

		return resp.status(200).json(reservation);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return resp.status(400).json({
				message: error.message,
			});
		}

		console.error(error);

		return resp.status(500).json({
			message: "Internal server error",
		});
	}
});

router.delete("/:id", async (req, resp) => {
	try {
		const { id } = req.params;

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			return resp.status(400).json({
				message: "Invalid reservation ID",
			});
		}

		const reservation = await Reservation.findByPk(id);

		if (!reservation) {
			return resp.status(404).json({
				message: "Reservation not found",
			});
		}

		await reservation.destroy();
		return resp.status(200).json({
			message: "Reservation deleted successfully",
		});
	} catch (error) {
		return resp.status(500).json({ message: "Internal server error" });
	}
});
