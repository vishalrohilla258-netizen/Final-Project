const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authroutes");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/apiroutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from your frontend
  credentials: true,              // Allow cookies and credentials
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
