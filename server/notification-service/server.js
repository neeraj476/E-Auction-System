import "./src/config/env.js";
import app from "./src/app.js";
import { pool } from "./src/config/db.js";
import { createNotificationsTable } from "./src/models/Notification.js";

const PORT = process.env.PORT || 8002;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL connected successfully");

    connection.release();

    await createNotificationsTable();

    app.listen(PORT, () => {
      console.log(`Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();