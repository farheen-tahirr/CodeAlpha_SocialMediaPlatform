const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    createPost,
    getAllPosts,
    getPostsByUser,
    likePost,
    deletePost,
    getTrending,
} = require("../controllers/postController");

const router = express.Router();


// ======================
// Create Post
// ======================

router.post("/", protect, createPost);


// ======================
// Get All Posts
// ======================

router.get("/", getAllPosts);


// ======================
// Trending Hashtags
// ======================

router.get("/trending", getTrending);


// ======================
// Get Posts By User
// ======================

router.get("/user/:userId", getPostsByUser);


// ======================
// Like / Unlike Post
// ======================

router.put("/:id/like", protect, likePost);


// ======================
// Delete Post
// ======================

router.delete("/:id", protect, deletePost);


module.exports = router;