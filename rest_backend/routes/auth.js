const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const router = express.Router();
const { validateUsername, validatePassword } = require("../utils/validate_user_details.js");

dotenv.config();

// Helper function for sending error responses
const sendError = (res, status, message) => res.status(status).json({ error: message });

// register user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
      return sendError(res, 400, usernameError);
    }

    // validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return sendError(res, 400, passwordError);
    }

    // check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return sendError(res, 400, "User already exists");
    }

    // create and save new user
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
      return sendError(res, 400, usernameError);
    }

    // validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return sendError(res, 400, passwordError);
    }

    // Find user in database
    const user = await User.findOne({ username });
    if (!user) {
      return sendError(res, 401, "Invalid credentials");
    }

    // compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 401, "Invalid credentials");
    }

    // generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
