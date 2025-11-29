const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const supabase = require("../config/database");
const { authenticate, authorize } = require("../middleware/auth");

// Load email service optionally (only needed for password reset)
let sendPasswordResetEmail;
try {
  const emailService = require("../services/emailService");
  sendPasswordResetEmail = emailService.sendPasswordResetEmail;
} catch (error) {
  console.warn("Email service not available (nodemailer may not be installed):", error.message);
  sendPasswordResetEmail = async () => ({ success: false, error: "Email service not configured" });
}

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (checkError) {
      console.error("Check user error:", checkError);
      return res.status(500).json({ error: "Server error during registration" });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with pending role
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        full_name: full_name || "",
        role: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert user error:", insertError);
      return res.status(500).json({ error: "Server error during registration" });
    }

    res.status(201).json({
      message: "Registration successful. Waiting for admin approval.",
      user_id: newUser.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (fetchError) {
      console.error("Fetch user error:", fetchError);
      console.error("Error details:", JSON.stringify(fetchError, null, 2));
      return res.status(500).json({ 
        error: "Server error during login",
        details: fetchError.message 
      });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Check if user is active
    if (user.status !== "active") {
      return res.status(401).json({ error: "Account is inactive" });
    }

    // Check password
    if (!user.password) {
      console.error("User has no password stored:", user.email);
      return res.status(500).json({ error: "User account error. Please contact administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", JSON.stringify(error, null, 2));
    res.status(500).json({ 
      error: "Server error during login",
      details: error.message 
    });
  }
});

// Get current user
router.get("/me", authenticate, async (req, res) => {
  try {
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id, email, full_name, role, status")
      .eq("id", req.user.id)
      .limit(1);

    if (fetchError) {
      console.error("Fetch user error:", fetchError);
      return res.status(500).json({ error: "Server error" });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .limit(1);

    if (fetchError) {
      console.error("Fetch user error:", fetchError);
      return res.status(500).json({ error: "Server error" });
    }

    // Always return success message (security best practice - don't reveal if email exists)
    if (!users || users.length === 0) {
      return res.json({
        message: "If that email exists, a password reset link has been sent.",
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Invalidate any existing reset tokens for this user
    await supabase
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("user_id", user.id)
      .eq("used", false);

    // Save reset token
    const { error: tokenError } = await supabase
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (tokenError) {
      console.error("Save token error:", tokenError);
      return res.status(500).json({ error: "Server error" });
    }

    // Send reset email
    const emailResult = await sendPasswordResetEmail(user.email, resetToken);

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      // Still return success to user (don't reveal email issues)
    }

    res.json({
      message: "If that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset password with token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ error: "Token and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Find valid reset token
    const { data: tokens, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .limit(1);

    if (tokenError) {
      console.error("Token lookup error:", tokenError);
      return res.status(500).json({ error: "Server error" });
    }

    if (!tokens || tokens.length === 0) {
      return res.status(400).json({
        error: "Invalid or expired reset token. Please request a new one.",
      });
    }

    const resetToken = tokens[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", resetToken.user_id);

    if (updateError) {
      console.error("Update password error:", updateError);
      return res.status(500).json({ error: "Server error" });
    }

    // Mark token as used
    await supabase
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("id", resetToken.id);

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
