const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    createPost,
    getAllPosts,
    getPostsByUser,
    likePost,
} = require("../controllers/postController");

const router = express.Router();

// Create Post
router.post("/", protect, createPost);

// Get All Posts
router.get("/", getAllPosts);
// Get Posts By User
router.get("/user/:userId", getPostsByUser);
// Like / Unlike Post
router.put("/:id/like", protect, likePost);

module.exports = router;