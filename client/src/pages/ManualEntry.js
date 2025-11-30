import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import axios from "axios";

const ManualEntry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoice_number: "",
    e_tax_status: "",
    cust_code: "",
    pages: "",
    currency: "",
    payment_method: "",
    net_total: "",
    delivery_instructions: "",
    payment_received_by: "",
    received_by_signature: "",
    delivered_by_signature: "",
    has_signatures: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    const updatedFormData = {
      ...formData,
      [e.target.name]: newValue,
    };
    
    // Auto-update has_signatures if either signature field is "Yes"
    if (e.target.name === "received_by_signature" || e.target.name === "delivered_by_signature") {
      const receivedSig = e.target.name === "received_by_signature" 
        ? newValue === "Yes" 
        : formData.received_by_signature === "Yes";
      const deliveredSig = e.target.name === "delivered_by_signature"
        ? newValue === "Yes"
        : formData.delivered_by_signature === "Yes";
      updatedFormData.has_signatures = receivedSig || deliveredSig ? "Yes" : "No";
    }
    
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    if (!formData.invoice_number) {
      setMessage({ type: "error", text: "Invoice number is required" });
      setSaving(false);
      return;
    }

    try {
      const response = await axios.post("/api/invoices/manual", formData);

      setMessage({
        type: "success",
        text: response.data.message || "Invoice created successfully",
      });
      setTimeout(() => {
        navigate("/invoices");
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to create invoice",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manual Invoice Entry
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Invoice Number"
              name="invoice_number"
              value={formData.invoice_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Pages"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="E-TAX Status"
              name="e_tax_status"
              value={formData.e_tax_status}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="CUST CODE"
              name="cust_code"
              value={formData.cust_code}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Payment Method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Net Total"
              name="net_total"
              type="text"
              value={formData.net_total}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="รับชำระโดย"
              name="payment_received_by"
              value={formData.payment_received_by}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Delivery Instructions"
              name="delivery_instructions"
              value={formData.delivery_instructions}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="มีลายมือชื่อผู้รับสินค้าใช่ไหม"
              name="received_by_signature"
              value={formData.received_by_signature || ""}
              placeholder="Yes or No"
              onChange={handleChange}
              helperText="Enter 'Yes' if signature detected, 'No' if not"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="มีลายมือชื่อผู้ส่งสินค้าใช่ไหม"
              name="delivered_by_signature"
              value={formData.delivered_by_signature || ""}
              placeholder="Yes or No"
              onChange={(e) => {
                handleChange(e);
                // Auto-update has_signatures if either signature is "Yes"
                const receivedSig = formData.received_by_signature === "Yes";
                const deliveredSig = e.target.value === "Yes";
                const hasSig = receivedSig || deliveredSig ? "Yes" : "No";
                setFormData(prev => ({ ...prev, has_signatures: hasSig }));
              }}
              helperText="Enter 'Yes' if signature detected, 'No' if not"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Invoice"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ManualEntry;
