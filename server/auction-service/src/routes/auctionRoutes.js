import express from "express";
import {
  createAuctionHandler,
  getAuctions,
  getAuction,
  getMyAuctions,
  cancelAuctionHandler,
} from "../controllers/auctionController.js";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import bidRoutes from "./bidRoutes.js";

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  (req, res, next) => {
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    next();
  },
  createAuctionHandler,
);

router.get("/mine", authMiddleware, getMyAuctions);
router.get("/", getAuctions);
router.delete("/:id", authMiddleware, cancelAuctionHandler);
router.get("/:id", getAuction);
router.use("/:auctionId/bids", bidRoutes);

export default router;
