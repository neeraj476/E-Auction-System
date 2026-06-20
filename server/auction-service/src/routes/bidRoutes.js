import express from "express";
import {
  placeBidHandler,
  getBidsHandler,
} from "../controllers/bidController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true }); // needed to access :auctionId from the parent router

router.post("/", authMiddleware, placeBidHandler);
router.get("/", getBidsHandler);

export default router;
