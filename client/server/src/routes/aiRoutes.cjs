const express = require("express");
const router = express.Router();
const { enhanceText } = require("../controllers/aiController.cjs");
const protectRoute = require("../middleware/auth.middleware.cjs");

router.post("/enhance", protectRoute, enhanceText);

module.exports = router;
