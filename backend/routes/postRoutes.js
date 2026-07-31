const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createPost } = require("../controllers/postController");

const router = express.Router();

// Create Post
router.post("/", protect, createPost);

module.exports = router;