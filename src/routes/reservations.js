import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	ReservationController.create,
); //user
router.get("/", adminMiddleware, ReservationController.getAll); //admin
router.get(
	"/:id",
	adminMiddleware,
	authMiddleware,
	chechUuidMiddleware,
	ReservationController.getById,
); //admin and user
router.put(
	"/:id",
	adminMiddleware,
	authMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	ReservationController.update,
); //admin and user (своє)
router.delete(
	"/:id",
	adminMiddleware,
	authMiddleware,
	chechUuidMiddleware,
	ReservationController.delete,
); //admin and user
