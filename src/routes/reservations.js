import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import checkUuidMiddleware from "../middleware/checkUUID.js";
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
	checkUuidMiddleware,
	ReservationController.getById,
);
router.put(
	"/:id",
	authMiddleware,
	adminMiddleware,
	validateBodyMiddleware,
	checkUuidMiddleware,
	ReservationController.update,
);
router.patch(
	"/:id/cancel",
	authMiddleware,
	checkUuidMiddleware,
	ReservationController.cancel,
);
router.delete(
	"/:id",
	authMiddleware,
	checkUuidMiddleware,
	ReservationController.delete,
);
