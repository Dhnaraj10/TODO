//backend\connection/connection.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGO_URI ? "URI is set" : "URI is NOT set");
    
    // Add connection options for better reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://dhanrajsingh:dhanraj10@cluster0.xsembmw.mongodb.net/?appName=Cluster0", options);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    console.log(`✅ Database name: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    console.error("Error details:", err); // Log full error details
    process.exit(1);
  }
};

module.exports = connectDB;