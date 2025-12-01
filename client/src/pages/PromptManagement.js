import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import axios from "axios";

const PromptManagement = () => {
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [promptData, setPromptData] = useState({
    name: "",
    instructions: "",
  });

  useEffect(() => {
    fetchActivePrompt();
  }, []);

  const fetchActivePrompt = async () => {
    try {
      const response = await axios.get("/api/prompts/active");
      const promptData = response.data.prompt;
      setPrompt(promptData);

      // Parse the prompt text
      let instructions = "";
      try {
        const parsed =
          typeof promptData.prompt_text === "string"
            ? JSON.parse(promptData.prompt_text)
            : promptData.prompt_text;
        instructions = parsed.instructions || JSON.stringify(parsed, null, 2);
      } catch (e) {
        instructions = promptData.prompt_text;
      }

      setPromptData({
        name: promptData.name,
        instructions: instructions,
      });
    } catch (error) {
      console.error("Error fetching prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!promptData.name || !promptData.instructions) {
      setMessage({ type: "error", text: "Name and instructions are required" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const promptText = {
        instructions: promptData.instructions,
      };

      if (prompt) {
        // Update existing prompt
        await axios.put(`/api/prompts/${prompt.id}`, {
          name: promptData.name,
          prompt_text: JSON.stringify(promptText),
          is_active: true,
        });
      } else {
        // Create new prompt
        await axios.post("/api/prompts", {
          name: promptData.name,
          prompt_text: JSON.stringify(promptText),
        });
      }

      setMessage({ type: "success", text: "Prompt saved successfully" });
      fetchActivePrompt();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to save prompt",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Prompt Management
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Prompt Name"
              value={promptData.name}
              onChange={(e) =>
                setPromptData({ ...promptData, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={20}
              label="Prompt Instructions (JSON format)"
              value={promptData.instructions}
              onChange={(e) =>
                setPromptData({ ...promptData, instructions: e.target.value })
              }
              helperText="Enter the prompt instructions. The system will wrap this in JSON format."
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Prompt"}
          </Button>
        </Box>

        {prompt && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Last Updated:</strong>{" "}
              {new Date(prompt.updated_at).toLocaleString()}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PromptManagement;






