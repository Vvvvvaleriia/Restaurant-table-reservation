import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	TableController.create,
);
router.get("/", TableController.getAll);
router.get("/:id", TableController.getById);
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	TableController.update,
);
router.delete("/:id", authMiddleware, TableController.delete);
