import { Router } from "express";
import TableController from "../controllers/table.js";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import checkUuidMiddleware from "../middleware/checkUUID.js";
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
router.get("/:id", checkUuidMiddleware, TableController.getById);
router.put(
	"/:id",
	authMiddleware,
	adminMiddleware,
	validateBodyMiddleware,
	checkUuidMiddleware,
	TableController.update,
);
router.delete(
	"/:id",
	authMiddleware,
	adminMiddleware,
	checkUuidMiddleware,
	TableController.delete,
);
