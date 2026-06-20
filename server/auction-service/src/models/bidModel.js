import { pool } from "../config/db.js";

export const createBidsTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  auction_id INT NOT NULL,
  bidder_id INT NOT NULL,              -- references users.id in auth_db (no FK, different DB)
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
);
  `;

  await pool.query(query);
  console.log("Bids Table Ready");
};

export const placeBid = async (auctionId, bidderId, amount) => {
  const [result] = await pool.query(
    "INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)",
    [auctionId, bidderId, amount],
  );
  return result.insertId;
};

export const getBidsForAuction = async (auctionId) => {
  const [rows] = await pool.query(
    "SELECT * FROM bids WHERE auction_id = ? ORDER BY amount DESC",
    [auctionId],
  );
  return rows;
};

export const getHighestBid = async (auctionId) => {
  const [rows] = await pool.query(
    "SELECT * FROM bids WHERE auction_id = ? ORDER BY amount DESC LIMIT 1",
    [auctionId],
  );
  return rows[0];
};
