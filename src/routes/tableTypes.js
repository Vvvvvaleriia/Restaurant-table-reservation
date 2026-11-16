import { Router } from "express";
import TableTypeController from "../controllers/tableType.js";
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
	TableTypeController.create,
);
router.get("/", TableTypeController.getAll);
router.get("/:id", checkUuidMiddleware, TableTypeController.getById);
router.put(
	"/:id",
	authMiddleware,
	adminMiddleware,
	validateBodyMiddleware,
	checkUuidMiddleware,
	TableTypeController.update,
);
router.delete(
	"/:id",
	authMiddleware,
	adminMiddleware,
	checkUuidMiddleware,
	TableTypeController.delete,
);
