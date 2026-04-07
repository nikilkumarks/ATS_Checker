const path = require("path");

// Load dotenv only if .env file exists (for local dev)
// In Vercel, env vars are set directly in process.env
try {
  require("dotenv").config({ path: path.join(__dirname, ".env") });
  require("dotenv").config({ path: path.join(__dirname, "../.env") });
  require("dotenv").config({ path: path.join(__dirname, "../client/server/.env") });
} catch (e) {
  console.log("dotenv load attempted (this is normal in Vercel)");
}

console.log("Environment check - MONGO_URI present:", !!process.env.MONGO_URI);
console.log("Environment check - JWT_SECRET present:", !!process.env.JWT_SECRET);

// Set up path to backend source
const serverPath = path.join(__dirname, "../client/server/src/server.cjs");

let app;

try {
  console.log("Loading server from:", serverPath);
  app = require(serverPath);
  console.log("Server loaded successfully");
  module.exports = app;
} catch (error) {
  console.error("❌ Failed to load server:", error.message);
  console.error("Stack:", error.stack);
  
  // Create fallback error handler
  const express = require("express");
  const fallbackApp = express();
  
  fallbackApp.use(express.json());
  
  fallbackApp.all("*", (req, res) => {
    res.status(500).json({
      error: "Serverless Function Failed",
      message: error.message,
      hint: "Check Vercel logs for details"
    });
  });
  
  module.exports = fallbackApp;
}
