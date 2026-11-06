import { Router } from "express";

export const router = Router();

router.post("/", TableController.create);
router.get("/", TableController.getAll);
router.get("/:id", TableController.getById);
router.put("/:id", TableController.update);
router.delete("/:id", TableController.delete);
