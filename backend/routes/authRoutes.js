const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeMiddleware");

const router = express.Router();


// ===============================
// Authentication Routes
// ===============================

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);


// ===============================
// Protected User Routes
// ===============================

// Get logged-in user's profile
router.get(
    "/profile",
    authenticateToken,
    getProfile
);

module.exports = router;