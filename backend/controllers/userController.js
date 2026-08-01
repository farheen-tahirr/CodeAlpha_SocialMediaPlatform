const User = require("../models/User");

// ======================
// Get User By ID
// ======================

const getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("followers", "name role")
            .populate("following", "name role");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let isFollowing = false;

        if (req.headers.authorization) {

            const token = req.headers.authorization.split(" ")[1];

            const decoded = require("jsonwebtoken").verify(
                token,
                process.env.JWT_SECRET
            );

            const currentUser = await User.findById(decoded.id);

            isFollowing = currentUser.following.some(
                id => id.toString() === user._id.toString()
            );
        }

        res.json({
            ...user.toObject(),
            isFollowing
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================
// Update Own Profile
// ======================

const updateProfile = async (req, res) => {
    try {
        const { bio, university, role } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.bio = bio ?? user.bio;
        user.university = university ?? user.university;
        user.role = role ?? user.role;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


// ======================
// Follow / Unfollow
// ======================

const followUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const userToFollow = await User.findById(req.params.id);

        if (!currentUser) {
            return res.status(404).json({
                message: "Logged-in user not found",
            });
        }

        if (!userToFollow) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Cannot follow yourself
        if (
            currentUser._id.toString() ===
            userToFollow._id.toString()
        ) {
            return res.status(400).json({
                message: "You cannot follow yourself",
            });
        }

        const alreadyFollowing =
            currentUser.following.some(
                id =>
                    id.toString() ===
                    userToFollow._id.toString()
            );

        // ======================
        // UNFOLLOW
        // ======================

        if (alreadyFollowing) {

            currentUser.following =
                currentUser.following.filter(
                    id =>
                        id.toString() !==
                        userToFollow._id.toString()
                );

            userToFollow.followers =
                userToFollow.followers.filter(
                    id =>
                        id.toString() !==
                        currentUser._id.toString()
                );

            await currentUser.save();
            await userToFollow.save();

            return res.status(200).json({
                message: "Unfollowed successfully",
                following: false,
                followersCount:
                    userToFollow.followers.length,
            });
        }

        // ======================
        // FOLLOW
        // ======================

        currentUser.following.push(
            userToFollow._id
        );

        userToFollow.followers.push(
            currentUser._id
        );

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({
            message: "Following successfully",
            following: true,
            followersCount:
                userToFollow.followers.length,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


// ======================
// Get Followers
// ======================

const getFollowers = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .populate(
                "followers",
                "name role university profileImage"
            )
            .select("followers");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user.followers);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


// ======================
// Get Following
// ======================

const getFollowing = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .populate(
                "following",
                "name role university profileImage"
            )
            .select("following");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user.following);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


module.exports = {
    getUserById,
    updateProfile,
    followUser,
    getFollowers,
    getFollowing,
};