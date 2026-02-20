// snippetController.js

const Snippet = require("../models/Snippet");
const User = require("../models/User");
const axios = require("axios");

// 🔹 Generate Snippet (Gemini + Credit System)
exports.generateSnippet = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Credit Check
    if (user.credits <= 0)
      return res.status(403).json({ message: "No credits left" });

    const { title, category, prompt } = req.body;
    if (!title || !category || !prompt)
      return res
        .status(400)
        .json({ message: "Title, category, and prompt are required" });

    // 🔥 Gemini API Call — Use Supported Model
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
        },
      }
    );

    const content =
      geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content)
      return res
        .status(500)
        .json({ message: "Gemini failed to generate content" });

    // Save Snippet
    const snippet = await Snippet.create({
      title,
      category,
      content,
      userId: user._id,
    });

    // Deduct 1 Credit
    user.credits -= 1;
    await user.save();

    return res.status(201).json({
      success: true,
      snippet,
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.error(
      "Generate Snippet Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message || "Snippet generation failed",
    });
  }
};

// 🔹 Get User Snippets
exports.getSnippets = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const snippets = await Snippet.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, snippets });
  } catch (error) {
    console.error("Get Snippets Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch snippets",
    });
  }
};

// 🔹 Delete Snippet
exports.deleteSnippet = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const snippet = await Snippet.findById(id);
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    if (!snippet.userId.equals(userId))
      return res.status(403).json({
        message: "You can only delete your own snippets",
      });

    await snippet.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Snippet deleted successfully",
    });
  } catch (error) {
    console.error("Delete Snippet Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete snippet",
    });
  }
};
