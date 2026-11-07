import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	ReviewController.create,
);
router.get("/", ReviewController.getAll);
router.get("/:id", chechUuidMiddleware, ReviewController.getById);
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	ReviewController.update,
); //user, але своє
router.delete(
	"/:id",
	adminMiddleware,
	authMiddleware,
	chechUuidMiddleware,
	ReviewController.delete,
); //admin and user
