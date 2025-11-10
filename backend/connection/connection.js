//backend\connection/connection.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://dhanrajsingh:dhanraj10@cluster0.xsembmw.mongodb.net/?appName=Cluster0");
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    console.error("Error details:", err); // Log full error details
    process.exit(1);
  }
};

module.exports = connectDB;