import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuctionDetails,
  cancelAuction,
} from "../models/auctionModel.js";

import cloudinary from "../config/cloudinary.js";

export const createAuctionHandler = async (req, res) => {
  try {
    console.log("Controller reached");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("FILE:", req.file);

    const { title, description, startingPrice, endTime } = req.body;
    const sellerId = req.user.id;

    if (!title || !startingPrice || !endTime) {
      return res.status(400).json({
        message: "Title, starting price, and end time are required",
      });
    }

    if (Number(startingPrice) <= 0) {
      return res.status(400).json({
        message: "Starting price must be greater than 0",
      });
    }

    const parsedEndTime = new Date(endTime);

    if (isNaN(parsedEndTime.getTime())) {
      return res.status(400).json({
        message: "Invalid end time format",
      });
    }

    if (parsedEndTime <= new Date()) {
      return res.status(400).json({
        message: "End time must be in the future",
      });
    }

    // CloudinaryStorage already uploaded the file (if present) before this
    // controller ran — req.file.path is the secure_url. No manual upload needed.
    const imageUrl = req.file ? req.file.path : null;

    console.log("IMAGE URL:", imageUrl);

    const auctionId = await createAuction(
      sellerId,
      title,
      description,
      startingPrice,
      parsedEndTime,
      imageUrl,
    );

    return res.status(201).json({
      message: "Auction created successfully",
      auctionId,
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getAuctions = async (req, res) => {
  try {
    const auctions = await getAllAuctions();
    res.status(200).json({ auctions });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await getAuctionById(id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.status(200).json({ auction });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAuctionHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    const auction = await getAuctionById(id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (auction.seller_id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own auction" });
    }

    if (auction.status !== "active") {
      return res
        .status(400)
        .json({ message: "Cannot update a closed or cancelled auction" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    await updateAuctionDetails(id, title, description);

    res.status(200).json({ message: "Auction updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelAuctionHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const auction = await getAuctionById(id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (auction.seller_id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only cancel your own auction" });
    }

    if (auction.status !== "active") {
      return res
        .status(400)
        .json({ message: "Auction is already closed or cancelled" });
    }

    await cancelAuction(id);

    res.status(200).json({ message: "Auction cancelled successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

import { getAuctionsBySeller } from "../models/auctionModel.js";

export const getMyAuctions = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const auctions = await getAuctionsBySeller(sellerId);
    res.status(200).json({ auctions });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
