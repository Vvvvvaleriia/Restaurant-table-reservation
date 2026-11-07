import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	TableController.create,
); //admiin
router.get("/", TableController.getAll);
router.get("/:id", chechUuidMiddleware, TableController.getById);
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	TableController.update,
); //admiin
router.delete(
	"/:id",
	authMiddleware,
	chechUuidMiddleware,
	TableController.delete,
); //admiin
