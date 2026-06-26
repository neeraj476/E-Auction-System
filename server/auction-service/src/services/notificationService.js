export const notifyAuctionEnded = async ({
  winnerEmail,
  sellerEmail,
  auctionTitle,
  finalPrice,
}) => {
  try {
    await fetch(`${process.env.NOTIFICATION_SERVICE_URL}/auction-ended`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
      body: JSON.stringify({
        winnerEmail,
        sellerEmail,
        auctionTitle,
        finalPrice,
      }),
    });
  } catch (error) {
    console.log("Failed to notify auction ended:", error.message);
  }
};

export const notifyOutbid = async ({
  previousBidderEmail,
  auctionTitle,
  newBidAmount,
}) => {
  try {
    await fetch(`${process.env.NOTIFICATION_SERVICE_URL}/outbid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
      body: JSON.stringify({ previousBidderEmail, auctionTitle, newBidAmount }),
    });
  } catch (error) {
    console.log("Failed to notify outbid:", error.message);
  }
};
