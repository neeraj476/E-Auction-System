import express from "express";
import {
  createAuctionHandler,
  getAuctions,
  getAuction,
} from "../controllers/auctionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import bidRoutes from "./bidRoutes.js";

const router = express.Router();

router.post("/", authMiddleware, createAuctionHandler);
router.get("/", getAuctions);
router.get("/:id", getAuction);
router.use("/:auctionId/bids", bidRoutes);

export default router;
