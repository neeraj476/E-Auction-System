import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  getUserByIdInternal
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyInternalKey } from "../middleware/internalAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getProfile);
router.get("/internal/users/:id", verifyInternalKey, getUserByIdInternal);

export default router;
