//backend\routes/auth.js
const router = require("express").Router(); 
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Email validation regex
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log("Register request received:", { email, username }); // Add logging
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log("Database not connected, current state:", mongoose.connection.readyState);
      return res.status(500).json({ 
        message: "Database connection error. Please try again later.",
        error: "Database not connected"
      });
    }

    // Basic validations
    if (!email || !username || !password) {
      console.log("Registration failed: Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      console.log("Registration failed: Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      console.log("Registration failed: Password too short");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    console.log("Checking for existing user...");
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        console.log("Registration failed: Email already exists");
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.username === username) {
        console.log("Registration failed: Username already exists");
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    console.log("Saving new user...");
    const savedUser = await newUser.save();
    console.log("User registered successfully:", savedUser.email); // Add logging

    res.status(201).json({ 
      message: "User registered successfully", 
      user: { 
        id: savedUser._id, 
        email: savedUser.email, 
        username: savedUser.username 
      } 
    });
  } catch (error) {
    console.error("Registration error:", error); // Add error logging
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      return res.status(500).json({ 
        message: "Database connection error. Please try again later.",
        error: error.message 
      });
    }
    
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", { email }); // Add logging
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log("Database not connected, current state:", mongoose.connection.readyState);
      return res.status(500).json({ 
        message: "Database connection error. Please try again later.",
        error: "Database not connected"
      });
    }

    // Basic validations
    if (!email || !password) {
      console.log("Login failed: Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: User not found");
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    console.log("Checking password...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed: Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User logged in successfully:", user.email); // Add logging

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Login error:", error); // Add error logging
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      return res.status(500).json({ 
        message: "Database connection error. Please try again later.",
        error: error.message 
      });
    }
    
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;