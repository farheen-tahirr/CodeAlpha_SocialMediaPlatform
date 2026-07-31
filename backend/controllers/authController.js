const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================
// Register User
// ======================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, university } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            university,
        });

        // Remove password before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// ======================
// Login User
// ======================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user INCLUDING password
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Remove password before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: "Login successful",
            token,
            user: userResponse,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
};