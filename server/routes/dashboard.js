const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const { authenticate } = require("../middleware/auth");

// Get dashboard statistics
router.get("/stats", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Build base query with optional user filter
    const isAdminOrSupervisor = ["admin", "supervisor"].includes(userRole);
    let baseQuery = supabase.from("invoices").select("*", { count: "exact" });
    if (!isAdminOrSupervisor) {
      baseQuery = baseQuery.eq("user_id", userId);
    }

    // Total invoices
    const { count: totalInvoices, error: totalError } = await baseQuery.select("*", { count: "exact", head: true });

    // Pending invoices
    let pendingQuery = supabase.from("invoices").select("*", { count: "exact", head: true }).eq("status", "pending");
    if (!isAdminOrSupervisor) {
      pendingQuery = pendingQuery.eq("user_id", userId);
    }
    const { count: pendingInvoices, error: pendingError } = await pendingQuery;

    // Approved invoices
    let approvedQuery = supabase.from("invoices").select("*", { count: "exact", head: true }).eq("status", "approved");
    if (!isAdminOrSupervisor) {
      approvedQuery = approvedQuery.eq("user_id", userId);
    }
    const { count: approvedInvoices, error: approvedError } = await approvedQuery;

    // Rejected invoices
    let rejectedQuery = supabase.from("invoices").select("*", { count: "exact", head: true }).eq("status", "rejected");
    if (!isAdminOrSupervisor) {
      rejectedQuery = rejectedQuery.eq("user_id", userId);
    }
    const { count: rejectedInvoices, error: rejectedError } = await rejectedQuery;

    // Recent invoices
    let recentQuery = supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!isAdminOrSupervisor) {
      recentQuery = recentQuery.eq("user_id", userId);
    }

    const { data: recentInvoices, error: recentError } = await recentQuery;
    
    // Get user info for recent invoices
    const recentUserIds = [...new Set((recentInvoices || []).map(inv => inv.user_id).filter(Boolean))];
    let recentUsersMap = {};
    if (recentUserIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, full_name")
        .in("id", recentUserIds);
      
      if (!usersError && users) {
        users.forEach(u => {
          recentUsersMap[u.id] = u;
        });
      }
    }

    // Status distribution
    let statusQuery = supabase
      .from("invoices")
      .select("status");
    
    if (!isAdminOrSupervisor) {
      statusQuery = statusQuery.eq("user_id", userId);
    }

    const { data: allInvoices, error: statusError } = await statusQuery;

    // Calculate status distribution
    const statusDistribution = {};
    if (allInvoices) {
      allInvoices.forEach((inv) => {
        statusDistribution[inv.status] = (statusDistribution[inv.status] || 0) + 1;
      });
    }

    const statusDistributionArray = Object.entries(statusDistribution).map(([status, count]) => ({
      status,
      count,
    }));

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

      let monthQuery = supabase
        .from("invoices")
        .select("*", { count: "exact", head: true })
        .gte("created_at", monthStart.toISOString())
        .lte("created_at", monthEnd.toISOString());

      if (!isAdminOrSupervisor) {
        monthQuery = monthQuery.eq("user_id", userId);
      }

      const { count: monthCount, error: monthError } = await monthQuery;
      monthlyStats.push({
        month,
        count: monthCount || 0,
      });
    }

    // Format recent invoices
    const formattedRecentInvoices = (recentInvoices || []).map((inv) => ({
      ...inv,
      user_email: recentUsersMap[inv.user_id]?.email,
      user_name: recentUsersMap[inv.user_id]?.full_name,
      extracted_data:
        typeof inv.extracted_data === "string"
          ? JSON.parse(inv.extracted_data)
          : inv.extracted_data,
    }));

    res.json({
      total_invoices: totalInvoices || 0,
      pending_invoices: pendingInvoices || 0,
      approved_invoices: approvedInvoices || 0,
      rejected_invoices: rejectedInvoices || 0,
      recent_invoices: formattedRecentInvoices,
      status_distribution: statusDistributionArray,
      monthly_stats: monthlyStats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
