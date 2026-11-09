import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import ReservationController from "../controllers/reservation.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	ReservationController.create,
);
router.get("/", authMiddleware, adminMiddleware, ReservationController.getAll);
router.get(
	"/:id",
	authMiddleware,
	chechUuidMiddleware,
	ReservationController.getById,
);
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	ReservationController.update,
);
router.delete(
	"/:id",
	authMiddleware,
	chechUuidMiddleware,
	ReservationController.delete,
);
