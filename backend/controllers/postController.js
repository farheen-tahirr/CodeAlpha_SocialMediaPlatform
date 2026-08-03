const Post = require("../models/Post");
const Comment = require("../models/Comment");

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

const postsWithComments = await Promise.all(

posts.map(async(post)=>{

const commentCount = await Comment.countDocuments({
post: post._id
});

return{

...post.toObject(),
commentCount

};

})

);

res.status(200).json(postsWithComments);

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

      const postsWithCounts = await Promise.all(

    posts.map(async (post) => {

        const commentCount = await Comment.countDocuments({
            post: post._id
        });

        return {
            ...post.toObject(),
            commentCount
        };

    })

);

res.status(200).json(postsWithCounts);
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
// ======================
// Delete Post
// ======================
const deletePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }

        // Only owner can delete
        if (post.user.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                message: "You can only delete your own posts."
            });

        }

        // Delete comments of this post
        await Comment.deleteMany({
            post: post._id
        });

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    createPost,
    getAllPosts,
    getPostsByUser,
    likePost,
    deletePost,
};