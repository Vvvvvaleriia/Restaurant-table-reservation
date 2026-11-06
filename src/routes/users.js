import { Router } from "express";
import UserController from "../controllers/user.js";
import authMiddleware from "../middleware/checkToken.js";

export const router = Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.put("/:id", authMiddleware, UserController.update); //кожен зареєстрований користувач
router.delete("/:id", authMiddleware, UserController.delete);
