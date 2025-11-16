// backend/routes/api.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user"); // Import your User model
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { run } = require("./genAI"); // Adjust the path as needed
dotenv.config();

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET; // Replace with a strong secret key

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received token:", token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token is required." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  });
};

// Route to get user profile data
router.get("/user/profile", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId; // Use ID from decoded JWT
    const user = await User.findById(userId, "-password -geminiResponse"); // Exclude password and geminiResponse fields

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE user by ID
router.delete("/users/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Admin users cannot be deleted." });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.error(error);
  }
});

// API endpoint to fetch users
router.get("/users", authenticateJWT, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check session route
router.get("/check-session", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("isAdmin");
    if (user) {
      return res.status(200).json({
        isLoggedIn: true,
        isAdmin: user.isAdmin,
      });
    }
    res.status(404).json({ isLoggedIn: false, isAdmin: false });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ isLoggedIn: false, error: "Server error" });
  }
});

// Endpoint to fetch questions
router.get("/question", (req, res) => {
  const index = parseInt(req.query.index, 10);
  const questions = [
    "What is your greatest strength, and how has it helped you succeed professionally?",
    "Tell me about a time you faced a challenge at work. How did you approach and resolve it?",
    "Where do you see yourself in five years, and how are you planning to achieve that goal?",
    "How do you handle feedback, especially when it's critical or unexpected?",
    "Describe a situation where you had to work with a difficult team member. What did you do?",
    "What motivates you to do your best work every day?",
    "How do you prioritize your tasks when you're juggling multiple deadlines?",
  ];

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  if (index < 0 || index >= questions.length) {
    return res.status(404).json({ error: "No more questions available" });
  }

  res.json({
    question: questions[index],
    totalQuestions: questions.length,
  });
});

router.post("/start-assessment", authenticateJWT, (req, res) => {
  try {
    const assessmentData = req.body;
    console.log("Assessment data received:", assessmentData);
    res.status(200).json({
      message: "Assessment started successfully",
      data: assessmentData,
    });
  } catch (error) {
    console.error("Error starting assessment:", error);
    res
      .status(500)
      .json({ message: "An error occurred while starting the assessment" });
  }
});

router.post("/submit-responses", authenticateJWT, async (req, res) => {
  const { responses } = req.body;
  console.log("Request body:", req.body); // 👈 Add this

  if (!Array.isArray(responses)) {
    return res.status(400).json({ error: "Responses should be an array" });
  }

  try {
    const assessments = await run(responses); // returns { responses: [...], assessments: [...] }
    console.log(assessments);

    const userId = req.user.userId;
    console.log(userId);

    const geminiEntry = {
      responses: assessments.responses.map((r) => ({
        _id: new mongoose.Types.ObjectId(),
        ...r,
      })),
      assessments: assessments.assessments.map((a) => ({
        _id: new mongoose.Types.ObjectId(),
        ...a,
      })),
      responseDate: new Date(),
      responseTime: new Date().toLocaleTimeString(),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { geminiResponse: geminiEntry } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Responses submitted successfully!",
      geminiResponse: geminiEntry,
    });
  } catch (error) {
    console.error("Error processing responses:", error.message, error.stack);
    res.status(500).json({ error: "Failed to process responses with Gemini" });
  }
});

router.get("/geminiResponse", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user || !user.geminiResponse) {
      return res.status(404).json({ message: "Gemini response not found" });
    }

    res.status(200).json({
      userId: user._id,
      geminiResponse: user.geminiResponse,
    });
  } catch (error) {
    console.error("Error fetching geminiResponse:", error);
    res.status(500).json({ message: "Error fetching geminiResponse" });
  }
});

module.exports = router;
