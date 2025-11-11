// Simplified startup script for faster deployment
// This script ensures quick startup by handling errors gracefully

const connectDB = require("./connection/connection");
const mongoose = require("mongoose");
const app = require('./app'); // Import the app

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the database connection
connectDB().then(() => {
  console.log("Database connection established");
  
  // Get port from environment variable or default to 1000
  const PORT = process.env.PORT || 1000;
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
    console.log(`Health check endpoint: http://localhost:${PORT}/healthz`);
  });
}).catch((error) => {
  console.error("Failed to connect to database:", error);
  console.error("Application will continue to start to allow for debugging");
  
  // Even if DB connection fails, start the server so we can debug via health endpoints
  const PORT = process.env.PORT || 1000;
  app.listen(PORT, () => {
    console.log(`⚠️ Server started on port ${PORT} WITHOUT database connection`);
    console.log(`Health check endpoint: http://localhost:${PORT}/healthz`);
  });
});