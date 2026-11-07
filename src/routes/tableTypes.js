import { Router } from "express";
import TableTypeController from "../services/tableType.js";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	TableTypeController.create,
);
router.get("/", TableTypeController.getAll);
router.get("/:id", TableTypeController.getById);
router.put(
	"/:id",
	validateBodyMiddleware,
	authMiddleware,
	TableTypeController.update,
);
router.delete("/:id", authMiddleware, TableTypeController.delete);
