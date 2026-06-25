import "./src/config/env.js";
import express from "express"
import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
const port = process.env.PORT;

app.use(express.json());
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});