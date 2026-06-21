import { sendEmail } from "../service/mailService.js";
import { logNotification } from "../models/Notification.js";

export const sendAuctionEndedEmail = async (req, res) => {
  try {
    const { winnerEmail, sellerEmail, auctionTitle, finalPrice } = req.body;

    if (!auctionTitle || !finalPrice) {
      return res
        .status(400)
        .json({ message: "auctionTitle and finalPrice are required" });
    }

    if (winnerEmail) {
      const subject = `You won "${auctionTitle}"!`;
      const html = `<p>You won <strong>${auctionTitle}</strong> at <strong>$${finalPrice}</strong>.</p>`;
      try {
        await sendEmail({ to: winnerEmail, subject, html });
        await logNotification({
          recipientEmail: winnerEmail,
          type: "auction_ended",
          subject,
          message: html,
          status: "sent",
        });
      } catch (err) {
        await logNotification({
          recipientEmail: winnerEmail,
          type: "auction_ended",
          subject,
          message: html,
          status: "failed",
          errorMessage: err.message,
        });
      }
    }

    if (sellerEmail) {
      const subject = `Your auction "${auctionTitle}" has ended`;
      const html = `<p>Your auction for <strong>${auctionTitle}</strong> ended at <strong>$${finalPrice}</strong>.</p>`;
      try {
        await sendEmail({ to: sellerEmail, subject, html });
        await logNotification({
          recipientEmail: sellerEmail,
          type: "auction_ended",
          subject,
          message: html,
          status: "sent",
        });
      } catch (err) {
        await logNotification({
          recipientEmail: sellerEmail,
          type: "auction_ended",
          subject,
          message: html,
          status: "failed",
          errorMessage: err.message,
        });
      }
    }

    res.status(200).json({ message: "Auction-ended notifications processed" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendOutbidEmail = async (req, res) => {
  try {
    const { previousBidderEmail, auctionTitle, newBidAmount } = req.body;

    if (!previousBidderEmail || !auctionTitle || !newBidAmount) {
      return res.status(400).json({
        message:
          "previousBidderEmail, auctionTitle, and newBidAmount are required",
      });
    }

    const subject = `You've been outbid on "${auctionTitle}"`;
    const html = `<p>Someone placed a higher bid of <strong>$${newBidAmount}</strong> on <strong>${auctionTitle}</strong>. Place a new bid to stay in the running!</p>`;

    try {
      await sendEmail({ to: previousBidderEmail, subject, html });
      await logNotification({
        recipientEmail: previousBidderEmail,
        type: "outbid",
        subject,
        message: html,
        status: "sent",
      });
      res.status(200).json({ message: "Outbid notification sent" });
    } catch (err) {
      await logNotification({
        recipientEmail: previousBidderEmail,
        type: "outbid",
        subject,
        message: html,
        status: "failed",
        errorMessage: err.message,
      });
      res.status(502).json({ message: "Failed to send email" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
