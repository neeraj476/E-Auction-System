import cron from "node-cron";
import {
  getExpiredActiveAuctions,
  closeAuction,
} from "../models/auctionModel.js";
import { getHighestBid } from "../models/bidModel.js";
import { getUserEmailById } from "../services/userService.js";
import { notifyAuctionEnded } from "../services/notificationService.js";

export const startAuctionScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const expiredAuctions = await getExpiredActiveAuctions();

      for (const auction of expiredAuctions) {
        const winningBid = await getHighestBid(auction.id);
        const winnerId = winningBid ? winningBid.bidder_id : null;
        console.log("scheduler");
        await closeAuction(auction.id, winnerId);
        
        if (winningBid) {
          console.log(
            `Auction ${auction.id} closed. Winner: user ${winnerId} at $${winningBid.amount}`,
          );

          const [sellerEmail, winnerEmail] = await Promise.all([
            getUserEmailById(auction.seller_id),
            getUserEmailById(winnerId),
          ]);

          await notifyAuctionEnded({
            winnerEmail,
            sellerEmail,
            auctionTitle: auction.title,
            finalPrice: winningBid.amount,
          });
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
