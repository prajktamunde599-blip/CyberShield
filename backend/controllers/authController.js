const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2. Find user by email
        const [users] = await db.query(
            "SELECT id, username, email, password_hash, role FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // 3. Compare password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        // 5. Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email and password are required"
            });
        }

        // 2. Check if username or email already exists
        const [existingUsers] = await db.query(
            "SELECT id FROM users WHERE username = ? OR email = ?",
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username or email already exists"
            });
        }

        // 3. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 4. Insert user into database.
        // Role is always "user" here so clients cannot self-assign admin.
        await db.query(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [username, email, passwordHash, "user"]
        );

        // 5. Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error("Profile error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error while fetching profile"
        });
    }
};

const checkAdminAccess = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin access granted",
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role
        }
    });
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    checkAdminAccess
};