const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const { authenticate, authorize } = require("../middleware/auth");

// Get active prompt
router.get("/active", authenticate, async (req, res) => {
  try {
    const { data: prompts, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Get prompt error:", error);
      return res.status(500).json({ error: "Server error" });
    }

    if (!prompts || prompts.length === 0) {
      return res.status(404).json({ error: "No active prompt found" });
    }

    const prompt = prompts[0];
    try {
      prompt.prompt_text = JSON.parse(prompt.prompt_text);
    } catch (e) {
      // If not JSON, keep as is
    }

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
      const { data: prompts, error } = await supabase
        .from("prompts")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Get prompts error:", error);
        return res.status(500).json({ error: "Server error" });
      }

      const formattedPrompts = (prompts || []).map((p) => {
        try {
          return {
            ...p,
            prompt_text: JSON.parse(p.prompt_text),
          };
        } catch (e) {
          return p;
        }
      });

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
      await supabase
        .from("prompts")
        .update({ is_active: false });

      // Insert new prompt
      const { data: newPrompt, error: insertError } = await supabase
        .from("prompts")
        .insert({
          name,
          prompt_text: JSON.stringify(parsedPrompt),
          is_active: true,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Create prompt error:", insertError);
        return res.status(500).json({ error: "Server error" });
      }

      res.status(201).json({
        message: "Prompt created successfully",
        prompt_id: newPrompt.id,
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
          await supabase
            .from("prompts")
            .update({ is_active: false })
            .neq("id", id);
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const { error } = await supabase
        .from("prompts")
        .update(updates)
        .eq("id", id);

      if (error) {
        console.error("Update prompt error:", error);
        return res.status(500).json({ error: "Server error" });
      }

      res.json({ message: "Prompt updated successfully" });
    } catch (error) {
      console.error("Update prompt error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
