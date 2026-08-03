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

        console.log("========== COMMENTS ==========");
        console.log("Post ID:", req.params.postId);

        const comments = await Comment.find({
            post: req.params.postId
        })
        .populate("user", "name profileImage role university")
        .sort({ createdAt: 1 });

        console.log("Comments found:", comments.length);

        res.status(200).json(comments);

    } catch (error) {

        console.log("========== ERROR ==========");
        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};
// ======================
// Delete Comment
// ======================
const deleteComment = async (req, res) => {

    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {

            return res.status(404).json({
                message: "Comment not found"
            });

        }

        if (
            comment.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                message: "Not authorized"
            });

        }

        await comment.deleteOne();

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    createComment,
    getComments,
    deleteComment,
};