import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import checkUuidMiddleware from "../middleware/checkUUID.js";
import ReviewController from "../controllers/review.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	ReviewController.create,
);
router.get("/", ReviewController.getAll);
router.get("/:id", checkUuidMiddleware, ReviewController.getById);
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	checkUuidMiddleware,
	ReviewController.update,
);
router.delete(
	"/:id",
	authMiddleware,
	checkUuidMiddleware,
	ReviewController.delete,
);
