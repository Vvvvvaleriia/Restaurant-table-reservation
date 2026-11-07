import { Router } from "express";
import UserController from "../controllers/user.js";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

export const router = Router();

router.get("/", adminMiddleware, UserController.getAll); //admin
router.get(
	"/:id",
	adminMiddleware,
	chechUuidMiddleware,
	UserController.getById,
); //admin and user (своє)
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	UserController.update,
); //перевіряти, щоб змінював лише власний
router.delete(
	"/:id",
	adminMiddleware,
	authMiddleware,
	chechUuidMiddleware,
	UserController.delete,
); //admin and user
