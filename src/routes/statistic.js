import { Router } from "express";
import authMiddleware from "../middleware/checkToken";
import adminMiddleware from "../middleware/adminMiddleware";
import StatsController from "../controllers/statistic";

export const router = Router();

router.get(
	"/admin/stats/table-type",
	authMiddleware,
	adminMiddleware,
	StatsController.getTableTypeStats,
);
