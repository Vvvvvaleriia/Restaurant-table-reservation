import { Router } from "express";
import { User } from "../models/index.js";

export const router = Router();

router.post("/", async (req, resp) => {
	const { name, email, phone, password_hash } = req.body ?? {};

	if (!name || !email || !phone || !password_hash) {
		return resp.status(400).json({
			message: "All fields are required",
		});
	}

	if (
		typeof name !== "string" ||
		typeof email !== "string" ||
		typeof phone !== "string" ||
		typeof password_hash !== "string"
	) {
		return resp.status(400).json({
			message: "All fields must be strings",
		});
	}

	if (!email.includes("@")) {
		return resp.status(400).json({
			message: "Incorrect email",
		});
	}

	// перевірка, чи існує email

	try {
		const user = await User.create(req.body, {
			fields: ["id", "name", "email", "phone", "password_hash"],
		});

		resp.status(201).json(user);
	} catch (error) {
		return resp.status(500).json({
			message: `${error}`,
		});
	}
});

router.get("/", async (req, resp) => {
	try {
		const users = await User.findAll();
		resp.status(200).json(users);
	} catch (error) {
		return resp.status(500).json({
			message: `${error}`,
		});
	}
});

router.get("/:id", async (req, resp) => {
	try {
		const user = await User.findByPk(req.params.id);
		resp.status(200).json(user);
	} catch (error) {
		return resp.status(500).json({ message: `${error}` });
	}
});

router.put("/:id", async (req, resp) => {
	try {
		const user = await User.findByPk(req.params.id);
		await user.update(req.body);
		resp.status(200).json(user);
	} catch (error) {
		return resp.status(500).json({
			message: `${error}`,
		});
	}
});

router.delete("/:id", async (req, resp) => {
	try {
		const user = await User.findByPk(req.params.id);
		await user.destroy();
		resp.status(200).json();
	} catch (error) {
		return resp.status(500).json({ message: `${error}` });
	}
});
