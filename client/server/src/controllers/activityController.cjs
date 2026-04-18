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

exports.logResumeCreateActivity = async (req, res) => {
    try {
        const { title, template } = req.body || {};

        await Activity.create({
            user: req.user.id,
            type: 'RESUME_CREATE',
            title: title || 'Resume Download',
            details: {
                template: template || 'classic'
            }
        });

        res.status(201).json({ message: 'Activity logged' });
    } catch (err) {
        console.error('Error logging resume create activity:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
