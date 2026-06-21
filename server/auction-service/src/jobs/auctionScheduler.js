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
        const winningBid = await getHighestBid(auction.id);
        const winnerId = winningBid ? winningBid.bidder_id : null;

        await closeAuction(auction.id, winnerId);

        if (winningBid) {
          console.log(
            `Auction ${auction.id} closed. Winner: user ${winnerId} at $${winningBid.amount}`,
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
