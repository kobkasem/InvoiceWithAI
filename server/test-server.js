// Minimal test server to verify Railway can run Node.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

console.log("🧪 TEST SERVER STARTING...");
console.log("📍 PORT:", PORT);
console.log("📍 NODE_ENV:", process.env.NODE_ENV || "not set");

// Simple health check
app.get("/api/health", (req, res) => {
  console.log("✅ Health check hit!");
  res.json({ status: "OK", message: "Test server is running", port: PORT });
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Test server", health: "/api/health" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ TEST SERVER running on port ${PORT}`);
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/api/health`);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

