import { Router } from "express";
import authMiddleware from "../middleware/checkToken.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import StatsController from "../controllers/statistic.js";

export const router = Router();

router.get(
	"/table-type",
	authMiddleware,
	adminMiddleware,
	StatsController.getTableTypeStats,
);
