// scripts/seedAdmin.js
// Run this ONCE to create the first Admin user
// Command: node scripts/seedAdmin.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.model.js";
import Category from "../models/Category.model.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existing = await User.findOne({ role: "Admin" });
    if (existing) {
      console.log("⚠️  Admin already exists:", existing.email);
      process.exit(0);
    }

    // Create Admin user
    const admin = await User.create({
      name: "System Admin",
      email: "admin@smartasset.com",
      password: "Admin@123",
      role: "Admin",
      isActive: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email   : admin@smartasset.com");
    console.log("🔑 Password: Admin@123");
    console.log("⚠️  Please change the password after first login!");

    // Seed categories too
    await Category.seedDefaults();

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
