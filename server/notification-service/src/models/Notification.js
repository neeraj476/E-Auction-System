import { pool } from "../config/db.js";

export const createNotificationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      recipient_email VARCHAR(150) NOT NULL,
      type VARCHAR(50) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT,
      status ENUM('sent', 'failed') NOT NULL,
      error_message TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("Notifications table ready");
};

export const logNotification = async ({
  recipientEmail,
  type,
  subject,
  message,
  status,
  errorMessage = null,
}) => {
  await pool.query(
    "INSERT INTO notifications (recipient_email, type, subject, message, status, error_message) VALUES (?, ?, ?, ?, ?, ?)",
    [recipientEmail, type, subject, message, status, errorMessage],
  );
};
