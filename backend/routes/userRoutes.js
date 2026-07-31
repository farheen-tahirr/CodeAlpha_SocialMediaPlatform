const express = require("express");
const protect = require("../middleware/authMiddleware");
const { followUser } = require("../controllers/userController");

const router = express.Router();

// Protected Profile Route
router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "Welcome to your profile!",
        user: req.user,
    });
});

// Follow / Unfollow
router.put("/:id/follow", protect, followUser);

module.exports = router;