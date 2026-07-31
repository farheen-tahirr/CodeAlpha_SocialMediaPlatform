const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    createComment,
    getComments,
} = require("../controllers/commentController");

const router = express.Router();

// Add Comment
router.post("/:postId", protect, createComment);

// Get Comments
router.get("/:postId", getComments);

module.exports = router;