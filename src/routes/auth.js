import { Router } from "express";
import AuthController from "../controllers/auth.js";
import authMiddleware from "../middleware/checkToken.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", authMiddleware, AuthController.profile);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
