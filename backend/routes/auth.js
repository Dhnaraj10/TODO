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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    const user = new User({ email, username, password: hashPassword });

    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    console.error("Registration error:", error); // Log the actual error for debugging
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// Sign in Route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Both email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found. Please sign up." });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const { password: _, ...others } = user._doc;
    res.status(200).json({ message: "Login successful", user: others });
  } catch (error) {
    console.error("Login error:", error); // Log the actual error for debugging
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;