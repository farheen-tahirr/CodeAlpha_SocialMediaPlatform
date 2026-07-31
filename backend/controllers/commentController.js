const Comment = require("../models/Comment");

// ======================
// Create Comment
// ======================
const createComment = async (req, res) => {
    try {

        const { content } = req.body;

        const comment = await Comment.create({
            post: req.params.postId,
            user: req.user._id,
            content,
        });

        res.status(201).json({
            message: "Comment added successfully",
            comment,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });

    }
};

// ======================
// Get Comments By Post
// ======================
const getComments = async (req, res) => {
    try {

        const comments = await Comment.find({
            post: req.params.postId,
        })
        .populate("user", "name profileImage role university")
        .sort({ createdAt: 1 });

        res.status(200).json(comments);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });

    }
};

module.exports = {
    createComment,
    getComments,
};