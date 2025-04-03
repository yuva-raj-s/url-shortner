import { Application, Request, Response } from "express";
import appRouter from "./route";
import connectDB from "./dbconfig";
import { redisClient } from "./redisconfig";
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: '../scripts.env' });

connectDB();
const app: Application = express();
//reseting redis

//  redisClient.flushall().then();
// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/", appRouter);
