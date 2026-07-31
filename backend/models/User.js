const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
    type: String,
    required: true,
    select: false,
},

        role: {
            type: String,
            enum: ["Student", "Fresher", "Alumni"],
            default: "Student",
        },

        university: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        profileImage: {
            type: String,
            default: "",
        },

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);