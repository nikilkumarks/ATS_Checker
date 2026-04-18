const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Load .env for local development; in cloud platforms process.env is already injected.
try {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
} catch (e) {
  console.log("dotenv not available");
}

// Log environment loading
console.log("Env vars available:", Object.keys(process.env).filter(k => k.startsWith("MONGO") || k.startsWith("JWT") || k.startsWith("COHERE") || k.startsWith("GOOGLE")).length, "keys");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("VERCEL:", !!process.env.VERCEL);
console.log("GOOGLE_CLIENT_ID present:", !!process.env.GOOGLE_CLIENT_ID);

// Check required env vars
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI environment variable not set!");
  console.error("Required env vars: MONGO_URI, JWT_SECRET");
}
if (!process.env.JWT_SECRET) {
  console.warn("⚠️  WARNING: JWT_SECRET environment variable not set!");
}

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

const clientPublicPath = path.resolve(__dirname, "..", "public");
const clientIndexPath = path.join(clientPublicPath, "index.html");

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

async function ensureDatabaseConnection(req, res, next) {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("DB Connection middleware error:", err.message);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
}

if (fs.existsSync(clientPublicPath)) {
  app.use(express.static(clientPublicPath));

  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      if (fs.existsSync(clientIndexPath)) {
        return res.sendFile(clientIndexPath);
      }

      return res.status(404).json({ message: "Frontend build not found" });
    }

    return next();
  });
}

// API Routes
app.use("/api/auth", ensureDatabaseConnection, authRoutes);
app.use("/api/activity", ensureDatabaseConnection, activityRoutes);
app.use("/api/scan", ensureDatabaseConnection, scanRoutes);
app.use("/api/ai", ensureDatabaseConnection, aiRoutes);
app.use("/api/admin", ensureDatabaseConnection, adminRoutes);
app.use("/api", ensureDatabaseConnection, router);

app.get("/api/test", (req, res) => {
  res.json({ message: "Serverless working" });
});

router.get("/dashboard", auth, (req, res) => {
  res.json({ user: req.user });
});

app.use((err, req, res, next) => {
  console.error("Unhandled API error:", err);
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: "Internal server error",
    error: err?.message || "Unknown error"
  });
});

module.exports = app;