const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/database");
const { authenticate, authorize } = require("../middleware/auth");

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
      return res.status(500).json({ error: "Server error during login" });
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
    res.status(500).json({ error: "Server error during login" });
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

module.exports = router;
