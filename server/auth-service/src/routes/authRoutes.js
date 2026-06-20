// src/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/me", verifyToken, getProfile);

export default router;