import express from "express";

import userRouter from "./api/userApi.js";
import connectDB from "./config/db.config.js";
import dotenv from "dotenv";
import profileRouter from "./api/profileApi.js";
dotenv.config();
const port = process.env.PORT;
connectDB();
const server = express();
// json support
server.use(express.json());
// will create the server instance.
server.use("/api/users", userRouter);
server.use("/api/profile", profileRouter);
// we mapped /api/users to userRouter==> after /api/users whatever the end point patterns will come right, will be handled by userRouter.

server.listen(port, () => {
  console.log("server listening on port" + port);
});
