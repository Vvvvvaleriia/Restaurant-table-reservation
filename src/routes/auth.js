import { Router } from "express";
import AuthController from "../controllers/auth.js";
import authMiddleware from "../middleware/checkToken.js";
import validateBodyMiddleware from "../middleware/validateBody.js";

const router = Router();

router.post("/register", validateBodyMiddleware, AuthController.register);
router.post("/login", validateBodyMiddleware, AuthController.login);
router.get("/profile", authMiddleware, AuthController.profile);
router.post("/refresh", validateBodyMiddleware, AuthController.refresh);
router.post("/logout", validateBodyMiddleware, AuthController.logout);
