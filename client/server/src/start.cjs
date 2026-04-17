const app = require("./server.cjs");

const preferredPort = Number(process.env.PORT) || 5000;
const maxPortAttempts = 10;

function startServer(port, attempt = 1) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && attempt < maxPortAttempts) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use, trying ${nextPort}...`);
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error("Failed to start server:", err.message);
    process.exitCode = 1;
  });
}

startServer(preferredPort);
