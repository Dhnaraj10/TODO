//backend\routes/auth.js
const router = require("express").Router(); 
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Email validation regex
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log("Register request received:", { email, username }); // Add logging

    // Basic validations
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

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
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", { email }); // Add logging

    // Basic validations
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
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
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;