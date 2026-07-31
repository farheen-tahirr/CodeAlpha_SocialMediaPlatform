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

module.exports = {
    createComment,
};