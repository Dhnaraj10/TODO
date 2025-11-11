//backend\connection/connection.js
const mongoose = require("mongoose");

const connectDB = async (retries = 5) => {
  try {
    // More robust environment variable handling
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://dhanrajsingh:dhanraj10@cluster0.xsembmw.mongodb.net/?appName=Cluster0";
    
    console.log("=== MongoDB Connection Diagnostics ===");
    console.log("Environment MONGO_URI set:", !!process.env.MONGO_URI);
    console.log("Using connection string:", mongoUri.replace(/\/\/(.*?):(.*?)@/, "//****:****@")); // Hide credentials
    console.log("Node environment:", process.env.NODE_ENV || "not set");
    console.log("=====================================");
    
    // Validate URI format
    if (!mongoUri || !mongoUri.startsWith("mongodb")) {
      throw new Error(`Invalid MongoDB URI format. Expected to start with 'mongodb', got: ${mongoUri.substring(0, 20)}...`);
    }
    
    // Add connection options for better reliability
    const options = {
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
      console.error("Please check:");
      console.error("1. MONGO_URI environment variable is properly set in Render");
      console.error("2. MongoDB Atlas cluster is running");
      console.error("3. IP whitelist in MongoDB Atlas includes Render's IP addresses");
    }
    
    if (err.message.includes("authentication failed")) {
      console.error("Authentication failed - please check username and password in MONGO_URI");
    }
    
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} retries left)`);
      setTimeout(() => {
        connectDB(retries - 1);
      }, 5000);
    } else {
      console.error("❌ MongoDB connection failed after all retries");
      console.error("=== CONNECTION DIAGNOSTICS ===");
      console.error("MONGO_URI set:", !!process.env.MONGO_URI);
      console.error("NODE_ENV:", process.env.NODE_ENV || "not set");
      console.error("Current working directory:", process.cwd());
      console.error("=== END DIAGNOSTICS ===");
      
      // Instead of exiting, reject the promise to allow caller to handle the error
      throw err;
    }
  }
};

module.exports = connectDB;