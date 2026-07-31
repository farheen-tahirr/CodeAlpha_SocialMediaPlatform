const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    getUserById,
    updateProfile,
    followUser,
    getFollowers,
    getFollowing,
} = require("../controllers/userController");

const router = express.Router();


// ======================
// Logged-in User
// ======================

router.get("/profile", protect, (req, res) => {

    res.status(200).json(req.user);

});


// ======================
// Own Profile Update
// ======================

router.put("/profile", protect, updateProfile);


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