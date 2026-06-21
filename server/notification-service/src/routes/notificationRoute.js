import express from "express";
import {
  sendAuctionEndedEmail,
  sendOutbidEmail,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/auction-ended", sendAuctionEndedEmail);
router.post("/outbid", sendOutbidEmail);

export default router;
