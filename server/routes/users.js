const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const { authenticate, authorize } = require("../middleware/auth");

// Get all users (admin only)
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, full_name, role, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get users error:", error);
      return res.status(500).json({ error: "Server error" });
    }

    res.json({ users: users || [] });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get pending users (admin only)
router.get("/pending", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, full_name, role, status, created_at")
      .eq("role", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get pending users error:", error);
      return res.status(500).json({ error: "Server error" });
    }

    res.json({ users: users || [] });
  } catch (error) {
    console.error("Get pending users error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user role (admin only)
router.put("/:id/role", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["pending", "user", "supervisor", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id);

    if (error) {
      console.error("Update role error:", error);
      return res.status(500).json({ error: "Server error" });
    }

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user status (admin only)
router.put(
  "/:id/status",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const { error } = await supabase
        .from("users")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error("Update status error:", error);
        return res.status(500).json({ error: "Server error" });
      }

      res.json({ message: "User status updated successfully" });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
