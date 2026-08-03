const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    getUserById,
    updateProfile,
    followUser,
    getFollowers,
    getFollowing,
    getAllUsers,
    deleteAccount
} = require("../controllers/userController");

const router = express.Router();


// ======================
// Logged-in User
// ======================


// ======================
// Own Profile
// ======================

router.get("/profile", protect, (req, res) => {
    res.status(200).json(req.user);
});

// ======================
// Update Profile
// ======================

router.put("/profile", protect, updateProfile);
// ======================
// Delete Own Account
// ======================

router.delete("/profile", protect, deleteAccount);


// ======================
// Get All Users
// ======================

router.get("/", getAllUsers);

// ======================
// Followers
// ======================

router.get("/:id/followers", getFollowers);

// ======================
// Following
// ======================

router.get("/:id/following", getFollowing);

// ======================
// Follow / Unfollow
// ======================

router.put("/:id/follow", protect, followUser);

// ======================
// Get Any User
// ======================

router.get("/:id", getUserById);

module.exports = router;
