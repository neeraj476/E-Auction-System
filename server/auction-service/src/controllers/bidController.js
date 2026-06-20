import { getAuctionById, updateAuctionPrice } from "../models/auctionModel.js";
import { placeBid, getBidsForAuction } from "../models/bidModel.js";

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

    const currentPrice = Number(auction.current_price);
    const bidAmount = Number(amount);
    const minRequired = currentPrice + MIN_BID_INCREMENT;

    if (bidAmount <= currentPrice || bidAmount < minRequired) {
      return res.status(400).json({
        message: `Bid must be at least ${minRequired.toFixed(2)}`,
      });
    }

    const bidId = await placeBid(auctionId, bidderId, bidAmount);
    await updateAuctionPrice(auctionId, bidAmount);

    res.status(201).json({ message: "Bid placed successfully", bidId });
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
