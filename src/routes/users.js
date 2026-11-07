import { Router } from "express";
import UserController from "../controllers/user.js";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";

export const router = Router();

router.get("/", UserController.getAll);
router.get("/:id", chechUuidMiddleware, UserController.getById);
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	UserController.update,
); //кожен зареєстрований користувач
router.delete(
	"/:id",
	authMiddleware,
	chechUuidMiddleware,
	UserController.delete,
);
