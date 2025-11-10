// Simplified startup script for faster deployment
// This script ensures quick startup by handling errors gracefully

const connectDB = require("./connection/connection");
const mongoose = require("mongoose");

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
  
  // Start the server after a brief delay to ensure connection is stable
  setTimeout(() => {
    try {
      require('./app'); // This will start the Express server
    } catch (error) {
      console.error("Failed to start application:", error);
      process.exit(1);
    }
  }, 1000);
}).catch((error) => {
  console.error("Failed to connect to database:", error);
  process.exit(1);
});