const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }

        // Check Bearer format
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const token = parts[1];

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set");
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        // Verify JWT signature and expiry
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        // Store decoded identity on the request for later authorization
        req.user = decoded;

        // Continue to the protected route
        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateToken;