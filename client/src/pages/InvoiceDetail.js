import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as ApproveIcon,
  Close as RejectIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSupervisor } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({});
  const [reviewDialog, setReviewDialog] = useState({ open: false, action: "" });

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(`/api/invoices/${id}`);
      setInvoice(response.data);
      setFormData({
        invoice_number: response.data.invoice_number || "",
        e_tax_status: response.data.e_tax_status || "",
        cust_code: response.data.cust_code || "",
        pages: response.data.pages || "",
        currency: response.data.currency || "",
        payment_method: response.data.payment_method || "",
        net_total: response.data.net_total || "",
        delivery_instructions: response.data.delivery_instructions || "",
        payment_received_by: response.data.payment_received_by || "",
        has_signatures: response.data.has_signatures || "",
      });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setMessage({ type: "error", text: "Failed to load invoice" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.put(`/api/invoices/${id}`, formData);
      setMessage({ type: "success", text: "Invoice updated successfully" });
      setTimeout(() => {
        navigate("/invoices");
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update invoice",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReview = async (action) => {
    try {
      await axios.post(`/api/invoices/${id}/review`, { action });
      setMessage({ type: "success", text: `Invoice ${action}d successfully` });
      setReviewDialog({ open: false, action: "" });
      fetchInvoice();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || `Failed to ${action} invoice`,
      });
    }
  };

  const handleCancel = async () => {
    try {
      await axios.post(`/api/invoices/${id}/cancel`);
      setMessage({ type: "success", text: "Invoice cancelled successfully" });
      setTimeout(() => {
        navigate("/invoices");
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to cancel invoice",
      });
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

  if (!invoice) {
    return <Alert severity="error">Invoice not found</Alert>;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Invoice Details</Typography>
        <Chip
          label={invoice.status}
          color={
            invoice.status === "approved"
              ? "success"
              : invoice.status === "rejected"
              ? "error"
              : "warning"
          }
        />
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Invoice Number"
              name="invoice_number"
              value={formData.invoice_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="E-TAX Status"
              name="e_tax_status"
              value={formData.e_tax_status}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CUST CODE"
              name="cust_code"
              value={formData.cust_code}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pages"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
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
              label="Payment Method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Net Total"
              name="net_total"
              type="number"
              value={formData.net_total}
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
              label="Payment Received By"
              name="payment_received_by"
              value={formData.payment_received_by}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Has Signatures"
              name="has_signatures"
              value={formData.has_signatures}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          {isSupervisor && invoice.status === "review" && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() =>
                  setReviewDialog({ open: true, action: "approve" })
                }
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() =>
                  setReviewDialog({ open: true, action: "reject" })
                }
              >
                Reject
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancel Invoice
          </Button>
        </Box>
      </Paper>

      {invoice.file_data_base64 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Invoice Image
          </Typography>
          <Box
            component="img"
            src={`data:image/jpeg;base64,${invoice.file_data_base64}`}
            alt="Invoice"
            sx={{ maxWidth: "100%", height: "auto" }}
          />
        </Paper>
      )}

      <Dialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ open: false, action: "" })}
      >
        <DialogTitle>
          Confirm {reviewDialog.action === "approve" ? "Approval" : "Rejection"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {reviewDialog.action} this invoice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog({ open: false, action: "" })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleReview(reviewDialog.action)}
            variant="contained"
            color={reviewDialog.action === "approve" ? "success" : "error"}
          >
            {reviewDialog.action === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceDetail;
