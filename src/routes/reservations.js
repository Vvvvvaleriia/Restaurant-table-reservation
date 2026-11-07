import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	ReservationController.create,
);
router.get("/", ReservationController.getAll);
router.get("/:id", authMiddleware, ReservationController.getById);
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	ReservationController.update,
);
router.delete("/:id", authMiddleware, ReservationController.delete);
