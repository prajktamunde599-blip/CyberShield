const db = require("../config/db");

const healthCheck = async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.status(200).json({
            success: true,
            message: "CyberShield API and database are working"
        });

    } catch (error) {
        console.error("Health check failed:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
};

module.exports = {
    healthCheck
};