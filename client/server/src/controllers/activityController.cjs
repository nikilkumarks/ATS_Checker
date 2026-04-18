const Activity = require('../models/Activity.cjs');

exports.getUserActivity = async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json(activities);
    } catch (err) {
        console.error("Error fetching activity:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
