import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getProfile);

export default router;
