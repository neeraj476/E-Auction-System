import "./src/config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import { pool } from "./src/config/db.js";
import { createAuctionsTable } from "./src/models/auctionModel.js";
import { createBidsTable } from "./src/models/bidModel.js";
import auctionRoutes from "./src/routes/auctionRoutes.js";
import { startAuctionScheduler } from "./src/jobs/auctionScheduler.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auctions", auctionRoutes);

const port = process.env.PORT;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MYSQL connected successfully");
    connection.release();

    await createAuctionsTable();
    await createBidsTable(); // must come after auctions table — bids has a FK to it

    console.log(`auction-service running on port ${port}`);
    startAuctionScheduler();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

startServer();
