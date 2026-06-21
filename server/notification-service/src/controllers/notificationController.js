import { sendEmail } from "../services/mailService.js";
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
      try {
        await sendEmail({
          to: winnerEmail,
          subject,
          html: `<p>You won <strong>${auctionTitle}</strong> at <strong>$${finalPrice}</strong>.</p>`,
        });
        await logNotification({
          recipientEmail: winnerEmail,
          type: "auction_ended",
          subject,
          status: "sent",
        });
      } catch (err) {
        await logNotification({
          recipientEmail: winnerEmail,
          type: "auction_ended",
          subject,
          status: "failed",
          errorMessage: err.message,
        });
      }
    }

    if (sellerEmail) {
      const subject = `Your auction "${auctionTitle}" has ended`;
      try {
        await sendEmail({
          to: sellerEmail,
          subject,
          html: `<p>Your auction for <strong>${auctionTitle}</strong> ended at <strong>$${finalPrice}</strong>.</p>`,
        });
        await logNotification({
          recipientEmail: sellerEmail,
          type: "auction_ended",
          subject,
          status: "sent",
        });
      } catch (err) {
        await logNotification({
          recipientEmail: sellerEmail,
          type: "auction_ended",
          subject,
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
