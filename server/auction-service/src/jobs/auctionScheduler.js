import cron from "node-cron";
import {
  getExpiredActiveAuctions,
  closeAuction,
} from "../models/auctionModel.js";
import { getHighestBid } from "../models/bidModel.js";

export const startAuctionScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const expiredAuctions = await getExpiredActiveAuctions();

      for (const auction of expiredAuctions) {
        await closeAuction(auction.id);

        const winningBid = await getHighestBid(auction.id);

        if (winningBid) {
          console.log(
            `Auction ${auction.id} closed. Winner: user ${winningBid.bidder_id} at $${winningBid.amount}`,
          );
        } else {
          console.log(`Auction ${auction.id} closed. No bids were placed.`);
        }
      }
    } catch (error) {
      console.log("Auction scheduler error:", error.message);
    }
  });

  console.log("Auction scheduler started — checking every minute");
};
