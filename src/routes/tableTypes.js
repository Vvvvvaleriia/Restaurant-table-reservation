import { Router } from "express";
import TableTypeController from "../services/tableType.js";

export const router = Router();

router.post("/", TableTypeController.create);
router.get("/", TableTypeController.getAll);
router.get("/:id", TableTypeController.getById);
router.put("/:id", TableTypeController.update);
router.delete("/:id", TableTypeController.delete);
