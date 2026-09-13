require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set in environment variables");
    process.exit(1);
}

async function startServer() {
    try {
        const connection = await db.getConnection();

        console.log("MySQL database connected successfully");

        connection.release();

        app.listen(PORT, () => {
            console.log(`CyberShield server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

startServer();