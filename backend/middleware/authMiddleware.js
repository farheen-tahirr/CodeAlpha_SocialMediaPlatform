const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {

        let token;

        // Check Authorization Header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If token not found
        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided.",
            });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get User (without password)
        req.user = await User.findById(decoded.id).select("-password");

        next();

    } catch (error) {

        res.status(401).json({
            message: "Invalid or expired token",
        });

    }
};

module.exports = protect;