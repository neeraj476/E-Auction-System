import "./src/config/env.js";
import { pool } from "./src/config/db.js";
import { createNotificationsTable } from "./src/models/Notification.js";
import express from "express";
import notificationRoutes from "./src/routes/notificationRoute.js";

const app = express();
app.use(express.json());
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err);
  res.status(500).json({ message: err.message });
});
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
