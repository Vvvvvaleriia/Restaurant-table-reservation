import { Router } from "express";

export const router = Router();

router.post("/", ReservationController.create);
router.get("/", ReservationController.getAll);
router.get("/:id", ReservationController.getById);
router.put("/:id", ReservationController.update);
router.delete("/:id", ReservationController.delete);
