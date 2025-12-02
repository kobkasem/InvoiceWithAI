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

// Health check (must be before other routes)
app.get("/api/health", (req, res) => {
  console.log("✅ Health check endpoint hit");
  res.json({ status: "OK", message: "Server is running", timestamp: new Date().toISOString() });
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
  app.use(express.static(clientBuildPath));

  // Catch-all handler: send back React's index.html for non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  console.warn("⚠️  Client build folder not found at:", clientBuildPath);
  console.warn("⚠️  Make sure to run 'npm run build' in client directory");
  
  // Fallback: serve a helpful error page
  app.get("/", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Synnex Invoice Extractor - Setup Required</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #1976d2; }
            .error { background: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .success { background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; }
            code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
            a { color: #1976d2; }
          </style>
        </head>
        <body>
          <h1>🚂 Synnex Invoice Extractor</h1>
          <div class="error">
            <h2>⚠️ Frontend Build Not Found</h2>
            <p>The React frontend build folder is missing. This usually means:</p>
            <ul>
              <li>The build didn't complete successfully</li>
              <li>Check Railway build logs for errors</li>
            </ul>
          </div>
          <div class="success">
            <h2>✅ Server is Running</h2>
            <p>Your Express server is running correctly!</p>
            <p>Test API: <a href="/api/health">/api/health</a></p>
          </div>
          <h2>🔧 How to Fix</h2>
          <ol>
            <li>Go to Railway Dashboard → Deployments</li>
            <li>Check build logs for errors</li>
            <li>Verify build command includes: <code>npm run build</code> in client directory</li>
            <li>Redeploy if needed</li>
          </ol>
        </body>
      </html>
    `);
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
