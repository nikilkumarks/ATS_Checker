const express = require("express");
const router = express.Router();
const { getUserActivity, logResumeCreateActivity } = require("../controllers/activityController.cjs");
const protectRoute = require("../middleware/auth.middleware.cjs");

router.get("/", protectRoute, getUserActivity);
router.post("/resume-create", protectRoute, logResumeCreateActivity);

module.exports = router;
