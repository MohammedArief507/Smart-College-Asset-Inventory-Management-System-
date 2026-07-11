import mongoose from "mongoose";
import Category from "../models/Category.model.js";

export const connectDB = async () => {
  try {
    console.log("DEBUG: MONGODB_URI=", process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);

    // Seed default categories on first run
    await Category.seedDefaults();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};
