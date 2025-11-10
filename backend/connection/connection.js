//backend\connection/connection.js
const mongoose = require("mongoose");

const connectDB = async (retries = 5) => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://dhanrajsingh:dhanraj10@cluster0.xsembmw.mongodb.net/?appName=Cluster0";
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI is set:", !!process.env.MONGO_URI);
    console.log("Using MongoDB URI:", mongoUri.substring(0, 30) + "..."); // Log first 30 chars for security
    
    // Add connection options for better reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(mongoUri, options);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    console.log(`✅ Database name: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Attempt to reconnect
      setTimeout(() => {
        connectDB(retries - 1);
      }, 5000);
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    console.error("Error details:", err.name, err.reason); // Log more error details
    
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} retries left)`);
      setTimeout(() => {
        connectDB(retries - 1);
      }, 5000);
    } else {
      console.error("❌ MongoDB connection failed after all retries");
      process.exit(1);
    }
  }
};

module.exports = connectDB;