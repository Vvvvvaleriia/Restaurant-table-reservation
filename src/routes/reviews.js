import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	ReviewController.create,
);
router.get("/", ReviewController.getAll);
router.get("/:id", ReviewController.getById);
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	ReviewController.update,
);
router.delete("/:id", authMiddleware, ReviewController.delete);
