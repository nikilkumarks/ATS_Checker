const express = require("express");
const router = express.Router();
const User = require("../models/users.cjs");
const Activity = require("../models/Activity.cjs");
const protectRoute = require("../middleware/auth.middleware.cjs");
const adminOnly = require("../middleware/admin.middleware.cjs");

// Get Admin Statistics
router.get("/stats", protectRoute, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const totalActivities = await Activity.countDocuments();
        const scanActivities = await Activity.countDocuments({ type: 'RESUME_SCAN' });
        const createActivities = await Activity.countDocuments({ type: 'RESUME_CREATE' });

        res.json({
            totalUsers,
            totalAdmins,
            totalActivities,
            scanActivities,
            createActivities
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Activities
router.get("/activities", protectRoute, adminOnly, async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(activities);
    } catch (error) {
        console.error("Error fetching admin activities:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
