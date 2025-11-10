//backend\connection/connection.js
const mongoose = require("mongoose");

const connectDB = async (retries = 5) => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://dhanrajsingh:dhanraj10@cluster0.xsembmw.mongodb.net/?appName=Cluster0";
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI is set:", !!process.env.MONGO_URI);
    console.log("Using MongoDB URI:", mongoUri.substring(0, 30) + "..."); // Log first 30 chars for security
    
    // Validate URI format
    if (!mongoUri.startsWith("mongodb")) {
      throw new Error("Invalid MongoDB URI format. Must start with 'mongodb'");
    }
    
    // Add connection options for better reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    console.log("Connecting with options:", {
      serverSelectionTimeoutMS: options.serverSelectionTimeoutMS,
      socketTimeoutMS: options.socketTimeoutMS,
      maxPoolSize: options.maxPoolSize
    });

    const conn = await mongoose.connect(mongoUri, options);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    console.log(`✅ Database name: ${conn.connection.name}`);
    console.log(`✅ Connection readyState: ${mongoose.connection.readyState}`);
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Attempt to reconnect
      if (retries > 0) {
        console.log(`Attempting to reconnect... (${retries} retries left)`);
        setTimeout(() => {
          connectDB(retries - 1);
        }, 5000);
      } else {
        console.error("❌ MongoDB reconnection failed after all retries");
      }
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
    return conn;
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    console.error("Error name:", err.name);
    console.error("Error code:", err.code);
    
    // Log specific error details based on error type
    if (err.name === 'MongooseServerSelectionError') {
      console.error("This usually indicates network connectivity issues or incorrect URI");
    }
    
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