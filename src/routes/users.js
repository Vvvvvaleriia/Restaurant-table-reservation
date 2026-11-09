import { Router } from "express";
import UserController from "../controllers/user.js";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

export const router = Router();

router.get("/", authMiddleware, adminMiddleware, UserController.getAll);
router.get("/:id", authMiddleware, chechUuidMiddleware, UserController.getById);
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	UserController.update,
);
router.delete(
	"/:id",
	authMiddleware,
	chechUuidMiddleware,
	UserController.delete,
);
