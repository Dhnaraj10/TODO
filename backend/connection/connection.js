//backend\connection/connection.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017");
    console.log("✅ Connected to Local MongoDB");
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  }
};

connectDB();
