import express from "express";
import cors from "cors";
import {createProxyMiddleware} from "http-proxy-middlware";

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true
}));

app.use("api/auth",createProxyMiddleware({
    target : process.env.AUTH_SERVICE_URL,
    changeOrigin : true
}));

app.use("/api/auctions",createProxyMiddleware({
    target : process.env.AUCTION_SERVICE_URL,
    changeOrigin:true,
}));

export default app;
