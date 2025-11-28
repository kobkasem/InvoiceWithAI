import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Close as RejectIcon,
} from "@mui/icons-material";
import axios from "axios";

const ReviewPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState({
    open: false,
    invoice: null,
    action: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/invoices", {
        params: { status: "review" },
      });
      setInvoices(response.data.invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action) => {
    try {
      await axios.post(`/api/invoices/${reviewDialog.invoice.id}/review`, {
        action,
      });
      setReviewDialog({ open: false, invoice: null, action: "" });
      fetchInvoices();
    } catch (error) {
      console.error("Error reviewing invoice:", error);
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
        Review Invoices
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice Number</TableCell>
              <TableCell>User</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    No invoices pending review
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.user_email}</TableCell>
                  <TableCell>{invoice.file_name}</TableCell>
                  <TableCell>
                    <Chip label={invoice.status} color="info" size="small" />
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <Button
                      size="small"
                      color="success"
                      startIcon={<ApproveIcon />}
                      onClick={() =>
                        setReviewDialog({
                          open: true,
                          invoice,
                          action: "approve",
                        })
                      }
                      sx={{ ml: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<RejectIcon />}
                      onClick={() =>
                        setReviewDialog({
                          open: true,
                          invoice,
                          action: "reject",
                        })
                      }
                      sx={{ ml: 1 }}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={reviewDialog.open}
        onClose={() =>
          setReviewDialog({ open: false, invoice: null, action: "" })
        }
      >
        <DialogTitle>
          Confirm {reviewDialog.action === "approve" ? "Approval" : "Rejection"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {reviewDialog.action} invoice{" "}
            {reviewDialog.invoice?.invoice_number}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setReviewDialog({ open: false, invoice: null, action: "" })
            }
          >
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

export default ReviewPage;




