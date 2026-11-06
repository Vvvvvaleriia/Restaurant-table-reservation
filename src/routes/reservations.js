import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";

export const router = Router();

router.post("/", authMiddleware, ReservationController.create);
router.get("/", ReservationController.getAll);
router.get("/:id", authMiddleware, ReservationController.getById);
router.put("/:id", authMiddleware, ReservationController.update);
router.delete("/:id", authMiddleware, ReservationController.delete);
