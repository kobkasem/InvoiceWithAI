const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const { authenticate } = require("../middleware/auth");

// Get dashboard statistics
router.get("/stats", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Total invoices
    let totalInvoicesQuery = "SELECT COUNT(*) as total FROM invoices";
    let totalInvoicesParams = [];

    // Pending invoices
    let pendingInvoicesQuery =
      "SELECT COUNT(*) as total FROM invoices WHERE status = 'pending'";
    let pendingInvoicesParams = [];

    // Approved invoices
    let approvedInvoicesQuery =
      "SELECT COUNT(*) as total FROM invoices WHERE status = 'approved'";
    let approvedInvoicesParams = [];

    // Rejected invoices
    let rejectedInvoicesQuery =
      "SELECT COUNT(*) as total FROM invoices WHERE status = 'rejected'";
    let rejectedInvoicesParams = [];

    // If user is not admin/supervisor, filter by user_id
    if (!["admin", "supervisor"].includes(userRole)) {
      totalInvoicesQuery += " WHERE user_id = ?";
      totalInvoicesParams.push(userId);
      pendingInvoicesQuery += " AND user_id = ?";
      pendingInvoicesParams.push(userId);
      approvedInvoicesQuery += " AND user_id = ?";
      approvedInvoicesParams.push(userId);
      rejectedInvoicesQuery += " AND user_id = ?";
      rejectedInvoicesParams.push(userId);
    }

    const [totalResult] = await pool.query(
      totalInvoicesQuery,
      totalInvoicesParams
    );
    const [pendingResult] = await pool.query(
      pendingInvoicesQuery,
      pendingInvoicesParams
    );
    const [approvedResult] = await pool.query(
      approvedInvoicesQuery,
      approvedInvoicesParams
    );
    const [rejectedResult] = await pool.query(
      rejectedInvoicesQuery,
      rejectedInvoicesParams
    );

    // Recent invoices
    let recentInvoicesQuery = `
      SELECT i.*, u.email as user_email, u.full_name as user_name
      FROM invoices i
      LEFT JOIN users u ON i.user_id = u.id
    `;
    let recentInvoicesParams = [];

    if (!["admin", "supervisor"].includes(userRole)) {
      recentInvoicesQuery += " WHERE i.user_id = ?";
      recentInvoicesParams.push(userId);
    }

    recentInvoicesQuery += " ORDER BY i.created_at DESC LIMIT 10";

    const [recentInvoices] = await pool.query(
      recentInvoicesQuery,
      recentInvoicesParams
    );

    // Status distribution
    let statusQuery = `
      SELECT status, COUNT(*) as count
      FROM invoices
    `;
    let statusParams = [];

    if (!["admin", "supervisor"].includes(userRole)) {
      statusQuery += " WHERE user_id = ?";
      statusParams.push(userId);
    }

    statusQuery += " GROUP BY status";

    const [statusDistribution] = await pool.query(statusQuery, statusParams);

    // Monthly statistics (last 6 months)
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      let monthQuery = `
        SELECT COUNT(*) as count
        FROM invoices
        WHERE created_at >= ? AND created_at <= ?
      `;
      let monthParams = [monthStart, monthEnd];

      if (!["admin", "supervisor"].includes(userRole)) {
        monthQuery += " AND user_id = ?";
        monthParams.push(userId);
      }

      const [monthResult] = await pool.query(monthQuery, monthParams);
      monthlyStats.push({
        month,
        count: monthResult[0].count,
      });
    }

    res.json({
      total_invoices: totalResult[0].total,
      pending_invoices: pendingResult[0].total,
      approved_invoices: approvedResult[0].total,
      rejected_invoices: rejectedResult[0].total,
      recent_invoices: recentInvoices.map((inv) => ({
        ...inv,
        extracted_data:
          typeof inv.extracted_data === "string"
            ? JSON.parse(inv.extracted_data)
            : inv.extracted_data,
      })),
      status_distribution: statusDistribution,
      monthly_stats: monthlyStats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;




