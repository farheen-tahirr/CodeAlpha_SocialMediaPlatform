const Message = require("../models/Message");

// ======================
// Send Message
// ======================

const sendMessage = async (req, res) => {

    try {

        const { receiver, content } = req.body;

        if (!receiver || !content || !content.trim()) {

            return res.status(400).json({
                message: "Receiver and message are required"
            });

        }

        const message = await Message.create({

            sender: req.user._id,

            receiver,

            content: content.trim()

        });

        const populatedMessage =
            await Message.findById(message._id)
                .populate("sender", "name role university")
                .populate("receiver", "name role university");

        res.status(201).json(populatedMessage);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================
// Get Conversation
// ======================

const getConversation = async (req, res) => {

    try {

        const otherUser = req.params.userId;

        const messages = await Message.find({

            $or: [

                {
                    sender: req.user._id,
                    receiver: otherUser
                },

                {
                    sender: otherUser,
                    receiver: req.user._id
                }

            ]

        })
        .populate("sender", "name role university")
        .populate("receiver", "name role university")
        .sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================
// Get My Conversations
// ======================

const getMyMessages = async (req, res) => {

    try {

        const messages = await Message.find({

            $or: [
                { sender: req.user._id },
                { receiver: req.user._id }
            ]

        })
        .populate("sender", "name role university")
        .populate("receiver", "name role university")
        .sort({ createdAt: -1 });

        res.status(200).json(messages);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


module.exports = {

    sendMessage,
    getConversation,
    getMyMessages

};