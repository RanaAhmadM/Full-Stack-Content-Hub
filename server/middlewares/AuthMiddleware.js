// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Token header me hona chahiye: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await User.findById(decoded.id).select("-password"); // password exclude
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;

    next(); // proceed to next middleware/controller
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
