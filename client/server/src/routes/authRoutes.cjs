const express = require("express");
const router = express.Router();
const { signup, login, googleAuth } = require("../controllers/authControllers.cjs");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);

module.exports = router;