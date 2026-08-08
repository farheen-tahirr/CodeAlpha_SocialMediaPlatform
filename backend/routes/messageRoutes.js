const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    sendMessage,
    getConversation,
    getMyMessages
} = require("../controllers/messageController");

const router = express.Router();


// ======================
// Get My Messages
// ======================

router.get(
    "/",
    protect,
    getMyMessages
);


// ======================
// Get Conversation
// ======================

router.get(
    "/:userId",
    protect,
    getConversation
);


// ======================
// Send Message
// ======================

router.post(
    "/",
    protect,
    sendMessage
);


module.exports = router;