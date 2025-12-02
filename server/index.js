const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const clientBuildPath = path.join(__dirname, "../client/build");

// Log startup info
console.log("🚀 Starting server...");
console.log("📍 PORT:", PORT);
console.log("📍 NODE_ENV:", process.env.NODE_ENV || "not set");
console.log("📍 Client build path:", clientBuildPath);
console.log("📍 Client build exists:", fs.existsSync(clientBuildPath));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle favicon requests to avoid CSP warnings
app.get("/favicon.ico", (req, res) => {
  const faviconPath = path.join(__dirname, "../client/public/favicon.ico");

  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
    return;
  }

  // If a favicon file is not available, respond with no content
  res.status(204).end();
});

// Health check - FIRST route, before anything else
app.get("/api/health", (req, res) => {
  console.log("✅ Health check endpoint hit");
  console.log("   Request URL:", req.url);
  console.log("   Request Original URL:", req.originalUrl);
  console.log("   Request Method:", req.method);
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    port: PORT,
    nodeEnv: process.env.NODE_ENV || "not set"
  });
});

// Test route - simple test
app.get("/test", (req, res) => {
  console.log("🧪 Test route hit");
  res.json({ test: "OK", message: "Server is responding" });
});

// Routes - load with error handling
try {
  console.log("📦 Loading API routes...");
  app.use("/api/auth", require("./routes/auth"));
  console.log("   ✅ /api/auth loaded");
  
  app.use("/api/users", require("./routes/users"));
  console.log("   ✅ /api/users loaded");
  
  app.use("/api/invoices", require("./routes/invoices"));
  console.log("   ✅ /api/invoices loaded");
  
  app.use("/api/prompts", require("./routes/prompts"));
  console.log("   ✅ /api/prompts loaded");
  
  app.use("/api/dashboard", require("./routes/dashboard"));
  console.log("   ✅ /api/dashboard loaded");
  
  console.log("✅ All API routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading routes:", error);
  // Don't crash - server can still serve health check
}

// 404 handler for API routes (must be before React static serving)
app.use("/api/*", (req, res) => {
  console.log(`❌ API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API endpoint not found", path: req.originalUrl });
});

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve client build in production (must be after API routes)
if (fs.existsSync(clientBuildPath)) {
  console.log("✅ Client build folder found, serving static files");
  
  // Serve static files (CSS, JS, images, etc.) but NOT index.html yet
  app.use(express.static(clientBuildPath, { index: false }));

  // Root route - serve React app
  app.get("/", (req, res) => {
    console.log("📍 Root route - serving React app");
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });

  // Catch-all handler: send back React's index.html for non-API routes
  // Exclude: /api/*, /test, /uploads/*
  app.get(/^\/(?!api|test|uploads).*/, (req, res) => {
    console.log("📍 Catch-all route - serving React app for:", req.url);
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  console.warn("⚠️  Client build folder not found at:", clientBuildPath);
  console.warn("⚠️  Make sure to run 'npm run build' in client directory");
  
  // Fallback root route when build doesn't exist
  app.get("/", (req, res) => {
    res.json({ 
      message: "Synnex Invoice Extractor API", 
      status: "running",
      frontend: "Build not found - check Railway build logs",
      health: "/api/health",
      test: "/test",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Health check available at: http://0.0.0.0:${PORT}/api/health`);
  console.log(`✅ API routes registered:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/auth/*`);
  console.log(`   - GET  /api/users/*`);
  console.log(`   - GET  /api/invoices/*`);
  console.log(`   - GET  /api/prompts/*`);
  console.log(`   - GET  /api/dashboard/*`);
});

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});
