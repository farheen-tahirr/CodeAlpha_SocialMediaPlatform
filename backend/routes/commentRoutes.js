const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createComment } = require("../controllers/commentController");

const router = express.Router();

// Add Comment
router.post("/:postId", protect, createComment);

module.exports = router;