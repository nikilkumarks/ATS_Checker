const path = require("path");

try {
  const app = require(path.join(__dirname, "../client/server/src/server.cjs"));
  module.exports = app;
} catch (error) {
  console.error("Failed to load server:", error.message);
  console.error("Stack:", error.stack);
  console.error("CWD:", process.cwd());
  console.error("__dirname:", __dirname);
  
  // Fallback: create minimal app if server load fails
  const express = require("express");
  const fallbackApp = express();
  
  fallbackApp.get("/api/test", (req, res) => {
    res.status(500).json({ 
      error: "Server initialization failed",
      details: error.message 
    });
  });
  
  module.exports = fallbackApp;
}
