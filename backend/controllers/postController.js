const Post = require("../models/Post");

// ======================
// Create Post
// ======================
const createPost = async (req, res) => {
    try {

        const { content, image } = req.body;

        const post = await Post.create({
            user: req.user._id,
            content,
            image,
        });

        res.status(201).json({
            message: "Post created successfully",
            post,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });

    }
};

module.exports = {
    createPost,
};