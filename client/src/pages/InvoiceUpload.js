import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import axios from "axios";

const InvoiceUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [extractedData, setExtractedData] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setMessage({ type: "", text: "" });
      setExtractedData(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file first" });
      return;
    }

    setUploading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/invoices/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({
        type: "success",
        text:
          response.data.message || "File uploaded and processed successfully!",
      });
      setExtractedData(response.data.extracted_data);
      setFile(null);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          error.response?.data?.details ||
          "Upload failed. Please try again.",
      });
      if (error.response?.data?.details) {
        console.error("Upload error details:", error.response.data.details);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Invoice
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload Invoice File
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Supported formats: JPEG, JPG, PNG, GIF, PDF
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.300",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: isDragActive ? "action.hover" : "background.paper",
            mb: 2,
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon
            sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
          />
          {isDragActive ? (
            <Typography>Drop the file here...</Typography>
          ) : (
            <>
              <Typography variant="body1" gutterBottom>
                Drag & drop a file here, or click to select
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {file ? `Selected: ${file.name}` : "No file selected"}
              </Typography>
            </>
          )}
        </Box>

        {file && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>File:</strong> {file.name} (
              {(file.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || uploading}
          fullWidth
        >
          {uploading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            "Upload and Extract"
          )}
        </Button>
      </Paper>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {extractedData && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Extracted Data
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(extractedData).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={key.replace(/_/g, " ").toUpperCase()}
                  value={value || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default InvoiceUpload;






