import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

export const router = Router();

router.post(
	"/",
	adminMiddleware,
	authMiddleware,
	validateBodyMiddleware,
	TableController.create,
); //admiin
router.get("/", TableController.getAll);
router.get("/:id", chechUuidMiddleware, TableController.getById);
router.put(
	"/:id",
	adminMiddleware,
	authMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	TableController.update,
); //admiin
router.delete(
	"/:id",
	adminMiddleware,
	authMiddleware,
	chechUuidMiddleware,
	TableController.delete,
); //admiin
