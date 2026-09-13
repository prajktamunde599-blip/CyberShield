const db = require("../config/db");

// Factory: returns middleware that allows only the given roles.
// Example: authorizeRoles("admin")
const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // This middleware must run AFTER authenticateToken
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            // Read the current role from the database.
            // The JWT proves identity; the database is the source of truth
            // for permissions (so a demoted admin cannot keep access).
            const [users] = await db.query(
                "SELECT role FROM users WHERE id = ?",
                [req.user.id]
            );

            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token"
                });
            }

            const currentRole = users[0].role;
            req.user.role = currentRole;

            if (!allowedRoles.includes(currentRole)) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to access this resource"
                });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Server error during authorization"
            });
        }
    };
};

module.exports = authorizeRoles;
