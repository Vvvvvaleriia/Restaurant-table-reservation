import { Router } from "express";
import { Review, User } from "../models";

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

		const allowedFields = ["userId", "rating", "comment"];
		const invalidFields = Object.keys(req.body).some(
			(field) => !allowedFields.includes(field),
		);

		if (invalidFields) {
			return resp.status(400).json({
				message: "Request contains invalid fields",
			});
		}

		const { userId, rating, comment } = req.body;

		if (userId === undefined || rating === undefined) {
			return resp.status(400).json({
				message: "User ID and rating are required",
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				userId,
			)
		) {
			return resp.status(400).json({
				message: "Invalid user ID",
			});
		}

		if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
			return resp.status(400).json({
				message: "Rating must be an integer between 1 and 5",
			});
		}

		if (
			comment !== undefined &&
			comment !== null &&
			typeof comment !== "string"
		) {
			return resp.status(400).json({
				message: "Comment must be a string",
			});
		}

		const user = await User.findByPk(userId);

		if (!user) {
			return resp.status(409).json({
				message: "User not found",
			});
		}

		const review = await Review.create({
			userId,
			rating,
			comment: comment?.trim() || null,
		});

		resp.status(201).json(review);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return resp.status(400).json({
				message: error.message,
			});
		}

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

		const reviews = await Review.findAll({
			limit: parsedLimit,
			offset: offset,
			order: [["createdAt", "DESC"]],
		});

		resp.status(200).json(reviews);
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
				message: "Invalid review ID",
			});
		}

		const review = await Review.findByPk(id);

		if (!review) {
			return resp.status(404).json({
				message: "Review not found",
			});
		}
		resp.status(200).json(review);
	} catch (error) {
		return resp.status(500).json({ message: "Internal server error" });
	}
});

router.put("/:id", async (req, resp) => {
	try {
		const { id } = req.params;
		const { userId, rating, comment } = req.body;

		if (
			!req.body ||
			typeof req.body !== "object" ||
			Array.isArray(req.body)
		) {
			return resp.status(400).json({
				message: "Request body must be an object",
			});
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
				id,
			)
		) {
			return resp.status(400).json({
				message: "Invalid review ID",
			});
		}

		const allowedFields = ["userId", "rating", "comment"];
		const fields = Object.keys(req.body);

		if (
			fields.length === 0 ||
			fields.some((field) => !allowedFields.includes(field))
		) {
			return resp
				.status(400)
				.json({ message: "Invalid or empty request body" });
		}

		const review = await Review.findByPk(id);

		if (!review) {
			return resp.status(404).json({
				message: "Review not found",
			});
		}

		if (userId !== undefined) {
			if (
				typeof userId !== "string" ||
				!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
					userId,
				)
			) {
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

		if (
			(rating !== undefined && !Number.isInteger(rating)) ||
			rating < 1 ||
			rating > 5
		) {
			return resp.status(400).json({
				message: "Rating must be an integer between 1 and 5",
			});
		}

		if (
			comment !== undefined &&
			comment !== null &&
			typeof comment !== "string"
		) {
			return resp.status(400).json({
				message: "Comment must be a string",
			});
		}

		await review.update({
			...(userId !== undefined && { userId }),
			...(rating !== undefined && { rating }),
			...(comment !== undefined && {
				comment: comment === null ? null : comment.trim(),
			}),
		});

		return resp.status(200).json(review);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return resp.status(400).json({
				message: error.message,
			});
		}

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
				message: "Invalid review ID",
			});
		}

		const review = await Review.findByPk(id);

		if (!review) {
			return resp.status(404).json({
				message: "Review not found",
			});
		}

		await review.destroy();
		return resp.status(200).json({
			message: "Review deleted successfully",
		});
	} catch (error) {
		return resp.status(500).json({ message: "Internal server error" });
	}
});
