import "./src/config/env.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
const port = process.env.PORT;
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err);
  res.status(500).json({ message: err.message });
});
app.use(express.json());
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
