import { Router } from "express";
import TableTypeController from "../services/tableType.js";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	TableTypeController.create,
); //admin
router.get("/", TableTypeController.getAll);
router.get("/:id", chechUuidMiddleware, TableTypeController.getById);
router.put(
	"/:id",
	validateBodyMiddleware,
	authMiddleware,
	chechUuidMiddleware,
	TableTypeController.update,
); //admin
router.delete(
	"/:id",
	authMiddleware,
	chechUuidMiddleware,
	TableTypeController.delete,
); //admin
