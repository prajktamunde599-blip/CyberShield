const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

// Basic API information
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to CyberShield API"
    });
});

module.exports = app;