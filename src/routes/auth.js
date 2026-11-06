import { Router } from "express";
import AuthController from "../controllers/auth.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", AuthController.profile);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
