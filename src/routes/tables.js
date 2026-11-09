import { Router } from "express";
import TableController from "../controllers/table.js";
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
	TableController.create,
);
router.get("/", TableController.getAll);
router.get("/:id", chechUuidMiddleware, TableController.getById);
router.put(
	"/:id",
	authMiddleware,
	adminMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	TableController.update,
);
router.delete(
	"/:id",
	authMiddleware,
	adminMiddleware,
	chechUuidMiddleware,
	TableController.delete,
);
