const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Route
router.get("/profile", protect, (req, res) => {

    res.status(200).json({
        message: "Welcome to your profile!",
        user: req.user,
    });

});

module.exports = router;