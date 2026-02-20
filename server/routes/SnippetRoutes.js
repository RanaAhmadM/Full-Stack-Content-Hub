const express = require("express");
const router = express.Router();
const {
  generateSnippet,
  getSnippets,
  deleteSnippet,
} = require("../controllers/SnippetController");
const authMiddleware = require("../middlewares/AuthMiddleware");

// POST /api/snippets/generate → generate new snippet (1 credit)
router.post("/generate", authMiddleware, generateSnippet);

// GET /api/snippets → get all user's snippets
router.get("/", authMiddleware, getSnippets);

// DELETE /api/snippets/:id → delete snippet
router.delete("/:id", authMiddleware, deleteSnippet);

module.exports = router;
