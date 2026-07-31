const User = require("../models/User");

// ======================
// Follow / Unfollow User
// ======================
const followUser = async (req, res) => {
    try {

        // User to follow
        const userToFollow = await User.findById(req.params.id);

        // Logged-in user
        const currentUser = await User.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Prevent following yourself
        if (userToFollow._id.toString() === currentUser._id.toString()) {
            return res.status(400).json({
                message: "You cannot follow yourself",
            });
        }

        const alreadyFollowing = currentUser.following.includes(userToFollow._id);

        if (alreadyFollowing) {

            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== userToFollow._id.toString()
            );

            userToFollow.followers = userToFollow.followers.filter(
                (id) => id.toString() !== currentUser._id.toString()
            );

            await currentUser.save();
            await userToFollow.save();

            return res.status(200).json({
                message: "User unfollowed",
            });
        }

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({
            message: "User followed successfully",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });

    }
};

module.exports = {
    followUser,
};