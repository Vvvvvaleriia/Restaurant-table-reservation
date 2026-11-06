import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";

export const router = Router();

router.post("/", authMiddleware, TableController.create);
router.get("/", TableController.getAll);
router.get("/:id", TableController.getById);
router.put("/:id", authMiddleware, TableController.update);
router.delete("/:id", authMiddleware, TableController.delete);
