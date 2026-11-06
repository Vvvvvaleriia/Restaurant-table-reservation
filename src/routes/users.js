import { Router } from "express";
import { User } from "../models/index.js";
import UserController from "../controllers/user.js";

export const router = Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);
