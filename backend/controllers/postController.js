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

// ======================
// Get All Posts
// ======================
const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find()
            .populate("user", "name university profileImage role")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });

    }
};
// ======================
// Get Posts By User
// ======================

const getPostsByUser = async (req, res) => {

    try {

        const posts = await Post.find({
            user: req.params.userId
        })
        .populate("user", "name role university")
        .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
// ======================
// Like / Unlike Post
// ======================
const likePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const alreadyLiked = post.likes.includes(req.user._id);

        if (alreadyLiked) {

            post.likes = post.likes.filter(
                (id) => id.toString() !== req.user._id.toString()
            );

            await post.save();

            return res.status(200).json({
                message: "Post unliked",
                likes: post.likes.length,
            });
        }

        post.likes.push(req.user._id);

        await post.save();

        res.status(200).json({
            message: "Post liked",
            likes: post.likes.length,
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
    getAllPosts,
    getPostsByUser,
    likePost,
};