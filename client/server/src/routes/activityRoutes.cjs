const express = require("express");
const router = express.Router();
const { getUserActivity } = require("../controllers/activityController.cjs");
const protectRoute = require("../middleware/auth.middleware.cjs");

router.get("/", protectRoute, getUserActivity);

module.exports = router;
