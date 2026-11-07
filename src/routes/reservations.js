import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";
import chechUuidMiddleware from "../middleware/checkUUID.js";

export const router = Router();

router.post(
	"/",
	authMiddleware,
	validateBodyMiddleware,
	ReservationController.create,
); //user
router.get("/", ReservationController.getAll); //admin
router.get(
	"/:id",
	authMiddleware,
	chechUuidMiddleware,
	ReservationController.getById,
); //admin and user
router.put(
	"/:id",
	authMiddleware,
	validateBodyMiddleware,
	chechUuidMiddleware,
	ReservationController.update,
); //admin and user (своє)
router.delete(
	"/:id",
	authMiddleware,
	chechUuidMiddleware,
	ReservationController.delete,
); //admin and user
