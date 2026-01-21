const express = require("express");
const router = express.Router();
const { scanResume } = require("../controllers/scanController.cjs");
const protectRoute = require("../middleware/auth.middleware.cjs");
const upload = require("../middleware/upload.middleware.cjs");

router.post("/", protectRoute, upload.single('resume'), scanResume);

module.exports = router;
