const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Log environment loading
console.log("Env vars available:", Object.keys(process.env).filter(k => k.startsWith("MONGO") || k.startsWith("JWT") || k.startsWith("COHERE")).length, "keys");

const authRoutes = require("./routes/authRoutes.cjs")
const activityRoutes = require("./routes/activityRoutes.cjs");
const scanRoutes = require("./routes/scanRoutes.cjs");
const aiRoutes = require("./routes/aiRoutes.cjs");
const adminRoutes = require("./routes/adminRoutes.cjs");
const auth = require("./middleware/auth.middleware.cjs");
const router = express.Router();

const app = express();
app.use(cors());
app.use(express.json());

let mongoConnectionPromise = null;

function connectToDatabase() {
  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("MongoDB Connected");
      })
      .catch(err => {
        mongoConnectionPromise = null;
        console.log("MongoDB Connection Error:", err.message);
        throw err;
      });
  }

  return mongoConnectionPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("DB Connection middleware error:", err.message);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", router);

app.get("/api/test", (req, res) => {
  res.json({ message: "Serverless working" });
});

router.get("/dashboard", auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = app;
