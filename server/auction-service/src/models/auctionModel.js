import { pool } from "../config/db.js";

export const createAuctionsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS auctions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      seller_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      starting_price DECIMAL(10,2) NOT NULL,
      current_price DECIMAL(10,2) NOT NULL,
      status ENUM('active', 'closed', 'cancelled') DEFAULT 'active',
      start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      end_time TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  await pool.query(query);
  console.log("Auctions Table Ready");
};

// createAuction , getAllAuctions , getAuctionById , updateAuctionPrice , closeAuction , getExpiredActiveAuctions

export const createAuction = async (
  sellerId,
  title,
  description,
  startingPrice,
  endTime,
) => {
  const [result] = await pool.query(
    `INSERT INTO auctions (seller_id, title, description, starting_price, current_price, end_time)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sellerId, title, description, startingPrice, startingPrice, endTime],
  );
  return result.insertId;
};

export const getAllAuctions = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM auctions WHERE status = 'active' ORDER BY end_time ASC",
  );
  return rows;
};

export const getAuctionById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM auctions WHERE id = ?", [id]);
  return rows[0];
};

export const updateAuctionPrice = async (id, newPrice) => {
  await pool.query("UPDATE auctions SET current_price = ? WHERE id = ?", [
    newPrice,
    id,
  ]);
};

export const closeAuction = async (id) => {
  await pool.query("UPDATE auctions SET status = 'closed' WHERE id = ?", [id]);
};

export const getExpiredActiveAuctions = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM auctions WHERE status = 'active' AND end_time <= NOW()",
  );
  return rows;
};

export const updateAuctionDetails = async (id, title, description) => {
  await pool.query(
    "UPDATE auctions SET title = ?, description = ? WHERE id = ?",
    [title, description, id],
  );
};

export const cancelAuction = async (id) => {
  await pool.query("UPDATE auctions SET status = 'cancelled' WHERE id = ?", [
    id,
  ]);
};
