import { getAuctionById, updateAuctionPrice } from "../models/auctionModel.js";
import { placeBid, getBidsForAuction, getHighestBid } from "../models/bidModel.js";
import { getUserEmailById } from "../services/userService.js";
import { notifyOutbid } from "../services/notificationService.js";

const MIN_BID_INCREMENT = Number(process.env.MIN_BID_INCREMENT) || 1;

export const placeBidHandler = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { amount } = req.body;
    const bidderId = req.user.id;

    if (!amount) {
      return res.status(400).json({ message: "Bid amount is required" });
    }

    const auction = await getAuctionById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }

    if (auction.seller_id === bidderId) {
      return res
        .status(403)
        .json({ message: "Sellers cannot bid on their own auction" });
    }
    console.log("inside bid controller");
    const currentPrice = Number(auction.current_price);
    const bidAmount = Number(amount);
    const minRequired = currentPrice + MIN_BID_INCREMENT;

    if (bidAmount <= currentPrice || bidAmount < minRequired) {
      return res.status(400).json({
        message: `Bid must be at least ${minRequired.toFixed(2)}`,
      });
    }

    // capture the previous highest bid BEFORE this new one overwrites it
    const previousHighestBid = await getHighestBid(auctionId);

    const bidId = await placeBid(auctionId, bidderId, bidAmount);
    await updateAuctionPrice(auctionId, bidAmount);

    res.status(201).json({ message: "Bid placed successfully", bidId });

    // Fire-and-forget — runs AFTER the response is sent, has its own
    // try/catch, so a failure here can never try to send a second response.
    if (previousHighestBid && previousHighestBid.bidder_id !== bidderId) {
      notifyPreviousBidder(previousHighestBid.bidder_id, auction.title, bidAmount);
      console.log("hello");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBidsHandler = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const bids = await getBidsForAuction(auctionId);
    res.status(200).json({ bids });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const notifyPreviousBidder = async (previousBidderId, auctionTitle, newBidAmount) => {
  try {
    const previousBidderEmail = await getUserEmailById(previousBidderId);
    if (previousBidderEmail) {
      await notifyOutbid({ previousBidderEmail, auctionTitle, newBidAmount });
    }
  } catch (error) {
    console.log("Failed to notify previous bidder:", error.message);
  }
};