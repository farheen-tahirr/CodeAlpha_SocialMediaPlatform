const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    createComment,
    getComments,
    deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// Add Comment
router.post("/:postId", protect, createComment);

// Get Comments
router.get("/:postId", getComments);

// Delete Comment
router.delete("/:commentId", protect, deleteComment);

module.exports = router;