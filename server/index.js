const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const clientBuildPath = path.join(__dirname, "../client/build");

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

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/invoices", require("./routes/invoices"));
app.use("/api/prompts", require("./routes/prompts"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve client build in production
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
