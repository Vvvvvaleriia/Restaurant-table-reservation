import { Router } from "express";
import TableTypeController from "../services/tableType.js";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	adminMiddleware,
	validateBodyMiddleware,
	TableTypeController.create,
);
router.get("/", TableTypeController.getAll);
router.get("/:id", chechUuidMiddleware, TableTypeController.getById);
router.put(
	"/:id",
	authMiddleware,
	adminMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	TableTypeController.update,
);
router.delete(
	"/:id",
	authMiddleware,
	adminMiddleware,
	chechUuidMiddleware,
	TableTypeController.delete,
);
