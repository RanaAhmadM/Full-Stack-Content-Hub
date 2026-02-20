// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes import (abhi placeholder, baad me create karenge)
const authRoutes = require("./routes/AuthRoutes");
const snippetRoutes = require("./routes/SnippetRoutes");

const app = express();

// Middleware
app.use(cors()); // frontend connect karne ke liye
app.use(express.json()); // JSON requests parse karne ke liye

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Smart Snippet Manager Backend Running 🔥");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

