import { Router } from "express";
import { Review, User } from "../models";

export const router = Router();

router.post("/", ReviewController.create);
router.get("/", ReviewController.getAll);
router.get("/:id", ReviewController.getById);
router.put("/:id", ReviewController.update);
router.delete("/:id", ReviewController.delete);
