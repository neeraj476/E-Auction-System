import "./src/config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import { pool } from "./src/config/db.js";
import { createUserTable } from "./src/models/userModel.js";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("AUTH SERVICE:", req.method, req.originalUrl);
  next();
});

app.use("/", authRoutes);
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err);
  res.status(500).json({ message: err.message });
});
const port = process.env.PORT;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MYSQL connected successfully");
    connection.release();

    await createUserTable();

    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

startServer();
