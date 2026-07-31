const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    createPost,
    getAllPosts,
} = require("../controllers/postController");

const router = express.Router();

// Create Post
router.post("/", protect, createPost);

// Get All Posts
router.get("/", getAllPosts);

module.exports = router;