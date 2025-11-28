const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const { authenticate, authorize } = require("../middleware/auth");

// Get active prompt
router.get("/active", authenticate, async (req, res) => {
  try {
    const [prompts] = await pool.query(
      "SELECT * FROM prompts WHERE is_active = TRUE ORDER BY updated_at DESC LIMIT 1"
    );

    if (prompts.length === 0) {
      return res.status(404).json({ error: "No active prompt found" });
    }

    const prompt = prompts[0];
    prompt.prompt_text = JSON.parse(prompt.prompt_text);

    res.json({ prompt });
  } catch (error) {
    console.error("Get prompt error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all prompts (admin/supervisor only)
router.get(
  "/",
  authenticate,
  authorize("admin", "supervisor"),
  async (req, res) => {
    try {
      const [prompts] = await pool.query(
        "SELECT * FROM prompts ORDER BY updated_at DESC"
      );

      const formattedPrompts = prompts.map((p) => ({
        ...p,
        prompt_text: JSON.parse(p.prompt_text),
      }));

      res.json({ prompts: formattedPrompts });
    } catch (error) {
      console.error("Get prompts error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Create new prompt (admin/supervisor only)
router.post(
  "/",
  authenticate,
  authorize("admin", "supervisor"),
  async (req, res) => {
    try {
      const { name, prompt_text } = req.body;

      if (!name || !prompt_text) {
        return res
          .status(400)
          .json({ error: "Name and prompt_text are required" });
      }

      // Validate JSON format
      let parsedPrompt;
      try {
        parsedPrompt =
          typeof prompt_text === "string"
            ? JSON.parse(prompt_text)
            : prompt_text;
      } catch (e) {
        return res
          .status(400)
          .json({ error: "Invalid JSON format for prompt_text" });
      }

      // Deactivate all other prompts
      await pool.query("UPDATE prompts SET is_active = FALSE");

      // Insert new prompt
      const [result] = await pool.query(
        "INSERT INTO prompts (name, prompt_text, is_active) VALUES (?, ?, ?)",
        [name, JSON.stringify(parsedPrompt), true]
      );

      res.status(201).json({
        message: "Prompt created successfully",
        prompt_id: result.insertId,
      });
    } catch (error) {
      console.error("Create prompt error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Update prompt (admin/supervisor only)
router.put(
  "/:id",
  authenticate,
  authorize("admin", "supervisor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, prompt_text, is_active } = req.body;

      const updates = {};
      if (name) updates.name = name;
      if (prompt_text) {
        try {
          const parsed =
            typeof prompt_text === "string"
              ? JSON.parse(prompt_text)
              : prompt_text;
          updates.prompt_text = JSON.stringify(parsed);
        } catch (e) {
          return res
            .status(400)
            .json({ error: "Invalid JSON format for prompt_text" });
        }
      }
      if (is_active !== undefined) {
        updates.is_active = is_active;
        // If activating this prompt, deactivate others
        if (is_active) {
          await pool.query(
            "UPDATE prompts SET is_active = FALSE WHERE id != ?",
            [id]
          );
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      await pool.query("UPDATE prompts SET ? WHERE id = ?", [updates, id]);

      res.json({ message: "Prompt updated successfully" });
    } catch (error) {
      console.error("Update prompt error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;




