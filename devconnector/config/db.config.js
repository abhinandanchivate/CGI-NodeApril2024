//
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("mongodb connected....");
  } catch (err) {}
};
export default connectDB;
