import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";

export const router = Router();

router.post("/", authMiddleware, ReviewController.create);
router.get("/", ReviewController.getAll);
router.get("/:id", ReviewController.getById);
router.put("/:id", authMiddleware, ReviewController.update);
router.delete("/:id", authMiddleware, ReviewController.delete);
