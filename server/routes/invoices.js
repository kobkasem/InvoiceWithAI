const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const supabase = require("../config/database");
const { authenticate, authorize } = require("../middleware/auth");
const { extractInvoiceData } = require("../services/aiService");
const { buildXml } = require("../services/xmlService");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files (JPEG, JPG, PNG, GIF) and PDF files are allowed"
        )
      );
    }
  },
});

// Create manual invoice entry
router.post("/manual", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      invoice_number,
      e_tax_status,
      cust_code,
      pages,
      currency,
      payment_method,
      net_total,
      delivery_instructions,
      payment_received_by,
      received_by_signature,
      delivered_by_signature,
      has_signatures,
    } = req.body;

    if (!invoice_number) {
      return res.status(400).json({ error: "Invoice number is required" });
    }

    // Compute has_signatures if not provided: "Yes" if either signature is "Yes"
    let computedHasSignatures = has_signatures;
    if (!computedHasSignatures) {
      if (received_by_signature === "Yes" || delivered_by_signature === "Yes") {
        computedHasSignatures = "Yes";
      } else {
        computedHasSignatures = "No";
      }
    }

    // Check if invoice number already exists (allow if previous invoice is cancelled)
    const { data: existing, error: checkError } = await supabase
      .from("invoices")
      .select("*")
      .eq("invoice_number", invoice_number)
      .limit(1);

    if (checkError) {
      console.error("Check invoice error:", checkError);
      return res.status(500).json({ error: "Server error" });
    }

    if (existing && existing.length > 0) {
      const existingInvoice = existing[0];
      // Allow re-entry if the existing invoice is cancelled
      if (existingInvoice.status !== "cancelled") {
        return res.status(400).json({ 
          error: "Invoice number already exists",
          details: `An invoice with this number already exists with status: ${existingInvoice.status}`
        });
      }
      // If cancelled, allow re-entry (will create new invoice with same number)
    }

    const extractedData = {
      e_tax_status: e_tax_status || null,
      invoice_number: invoice_number,
      cust_code: cust_code || null,
      pages: pages || null,
      currency: currency || null,
      payment_method: payment_method || null,
      net_total: net_total || null,
      delivery_instructions: delivery_instructions || null,
      payment_received_by: payment_received_by || null,
      received_by_signature: received_by_signature || null,
      delivered_by_signature: delivered_by_signature || null,
      has_signatures: computedHasSignatures || null,
    };

    // Prepare insert data
    const insertData = {
      invoice_number,
      user_id: userId,
      file_name: "manual_entry.txt",
      file_type: "manual",
      file_data: null,
      file_path: null,
      corner_number: null,
      e_tax_status: e_tax_status || null,
      cust_code: cust_code || null,
      pages: pages || null,
      currency: currency || null,
      payment_method: payment_method || null,
      net_total: net_total ? parseFloat(net_total) : null,
      delivery_instructions: delivery_instructions || null,
      payment_received_by: payment_received_by || null,
      has_signatures: computedHasSignatures || null,
      extracted_data: extractedData,
      status: "pending",
    };

    // Add signature fields only if provided
    if (received_by_signature !== undefined) {
      insertData.received_by_signature = received_by_signature || null;
    }
    if (delivered_by_signature !== undefined) {
      insertData.delivered_by_signature = delivered_by_signature || null;
    }

    // Save to database
    const { data: newInvoice, error: insertError } = await supabase
      .from("invoices")
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert invoice error:", insertError);
      return res.status(500).json({ error: "Server error during manual entry" });
    }

    // Create JSON file
    const jsonDir = path.join(__dirname, "../exports/json");
    if (!fs.existsSync(jsonDir)) {
      fs.mkdirSync(jsonDir, { recursive: true });
    }
    const jsonFilePath = path.join(jsonDir, `${invoice_number}.json`);
    fs.writeFileSync(
      jsonFilePath,
      JSON.stringify(extractedData, null, 2),
      "utf8"
    );

    // Create XML file
    const xmlDir = path.join(__dirname, "../exports/xml");
    if (!fs.existsSync(xmlDir)) {
      fs.mkdirSync(xmlDir, { recursive: true });
    }
    const xmlFilePath = path.join(xmlDir, `${invoice_number}.xml`);
    const xmlContent = buildXml(extractedData);
    fs.writeFileSync(xmlFilePath, xmlContent, "utf8");

    res.json({
      message: "Invoice created successfully",
      invoice_id: newInvoice.id,
      invoice_number: invoice_number,
      extracted_data: extractedData,
      json_file: jsonFilePath,
      xml_file: xmlFilePath,
    });
  } catch (error) {
    console.error("Manual entry error:", error);
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);
    res.status(500).json({
      error: "Server error during manual entry",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Upload and extract invoice
router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.user.id;
      const filePath = req.file.path;
      const fileName = req.file.originalname;
      const fileType = req.file.mimetype.startsWith("image/") ? "image" : "pdf";

      // Read file data for database storage
      const fileData = fs.readFileSync(filePath);

      // Get active prompt
      const { data: prompts, error: promptError } = await supabase
        .from("prompts")
        .select("*")
        .eq("is_active", true)
        .limit(1);

      if (promptError || !prompts || prompts.length === 0) {
        return res.status(500).json({ error: "No active prompt found" });
      }

      const prompt = prompts[0];
      let promptText;
      try {
        const parsed = JSON.parse(prompt.prompt_text);
        promptText = parsed.instructions || prompt.prompt_text;
      } catch (e) {
        promptText = prompt.prompt_text;
      }

      // Extract data using AI
      const extractionResult = await extractInvoiceData(
        filePath,
        fileType,
        promptText
      );

      if (!extractionResult.success) {
        // Save invoice with error status
        const { error: insertError } = await supabase
          .from("invoices")
          .insert({
            invoice_number: `ERROR_${Date.now()}`,
            user_id: userId,
            file_name: fileName,
            file_type: fileType,
            file_data: fileData,
            file_path: filePath,
            status: "pending",
            extracted_data: { error: extractionResult.error },
          });

        if (insertError) {
          console.error("Insert error invoice error:", insertError);
        }

        return res.status(500).json({
          error: "Failed to extract invoice data",
          details: extractionResult.error,
          message:
            "File uploaded but extraction failed. Please try again or enter data manually.",
        });
      }

      const extractedData = extractionResult.data;
      // Ensure corner_number is not included
      if (
        extractedData &&
        Object.prototype.hasOwnProperty.call(extractedData, "corner_number")
      ) {
        delete extractedData.corner_number;
      }
      const invoiceNumber = extractedData.invoice_number || `INV_${Date.now()}`;

      // Check if invoice number already exists (allow if previous invoice is cancelled)
      const { data: existing, error: checkError } = await supabase
        .from("invoices")
        .select("*")
        .eq("invoice_number", invoiceNumber)
        .limit(1);

      if (checkError) {
        console.error("Check invoice error:", checkError);
      }

      if (existing && existing.length > 0) {
        const existingInvoice = existing[0];
        // Allow re-entry if the existing invoice is cancelled
        if (existingInvoice.status !== "cancelled") {
          return res.status(400).json({ 
            error: "Invoice number already exists",
            details: `An invoice with this number already exists with status: ${existingInvoice.status}`
          });
        }
        // If cancelled, allow re-entry (will create new invoice with same number)
      }

      // Prepare insert data
      const insertData = {
        invoice_number: invoiceNumber,
        user_id: userId,
        file_name: fileName,
        file_type: fileType,
        file_data: fileData,
        file_path: filePath,
        corner_number: null,
        e_tax_status: extractedData.e_tax_status || null,
        cust_code: extractedData.cust_code || null,
        pages: extractedData.pages || null,
        currency: extractedData.currency || null,
        payment_method: extractedData.payment_method || null,
        net_total: extractedData.net_total ? parseFloat(extractedData.net_total) : null,
        delivery_instructions: extractedData.delivery_instructions || null,
        payment_received_by: extractedData.payment_received_by || null,
        has_signatures: extractedData.has_signatures || null,
        extracted_data: extractedData,
        status: "pending",
      };

      // Add signature fields only if they exist in extractedData
      if (extractedData.received_by_signature !== undefined) {
        insertData.received_by_signature = extractedData.received_by_signature || null;
      }
      if (extractedData.delivered_by_signature !== undefined) {
        insertData.delivered_by_signature = extractedData.delivered_by_signature || null;
      }

      // Save to database
      const { data: newInvoice, error: insertError } = await supabase
        .from("invoices")
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error("Insert invoice error:", insertError);
        return res.status(500).json({ error: "Server error during upload" });
      }

      // Create JSON file
      const jsonDir = path.join(__dirname, "../exports/json");
      if (!fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir, { recursive: true });
      }
      const jsonFilePath = path.join(jsonDir, `${invoiceNumber}.json`);
      fs.writeFileSync(
        jsonFilePath,
        JSON.stringify(extractedData, null, 2),
        "utf8"
      );

      // Create XML file
      const xmlDir = path.join(__dirname, "../exports/xml");
      if (!fs.existsSync(xmlDir)) {
        fs.mkdirSync(xmlDir, { recursive: true });
      }
      const xmlFilePath = path.join(xmlDir, `${invoiceNumber}.xml`);
      const xmlContent = buildXml(extractedData);
      fs.writeFileSync(xmlFilePath, xmlContent, "utf8");

      res.json({
        message: "File uploaded and processed successfully",
        invoice_id: newInvoice.id,
        invoice_number: invoiceNumber,
        extracted_data: extractedData,
        json_file: jsonFilePath,
        xml_file: xmlFilePath,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ error: "Server error during upload", details: error.message });
    }
  }
);

// Get all invoices
router.get("/", authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // First get invoices
    let query = supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: invoices, error } = await query;

    if (error) {
      console.error("Get invoices error:", error);
      return res.status(500).json({ error: "Server error" });
    }

    // Get total count
    let countQuery = supabase.from("invoices").select("*", { count: "exact", head: true });
    if (status) {
      countQuery = countQuery.eq("status", status);
    }
    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error("Count error:", countError);
    }

    // Get user info for all invoices
    const userIds = [...new Set(invoices.map(inv => inv.user_id).filter(Boolean))];
    const reviewerIds = [...new Set(invoices.map(inv => inv.reviewed_by).filter(Boolean))];
    const allUserIds = [...new Set([...userIds, ...reviewerIds])];
    
    let usersMap = {};
    if (allUserIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, full_name")
        .in("id", allUserIds);
      
      if (!usersError && users) {
        users.forEach(u => {
          usersMap[u.id] = u;
        });
      }
    }
    
    // Format invoices with user info
    const formattedInvoices = (invoices || []).map((inv) => ({
      ...inv,
      user_email: usersMap[inv.user_id]?.email,
      user_name: usersMap[inv.user_id]?.full_name,
      reviewer_email: usersMap[inv.reviewed_by]?.email,
      reviewer_name: usersMap[inv.reviewed_by]?.full_name,
      extracted_data:
        typeof inv.extracted_data === "string"
          ? JSON.parse(inv.extracted_data)
          : inv.extracted_data,
    }));

    res.json({
      invoices: formattedInvoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get invoice by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (error || !invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Get user and reviewer info
    const userIds = [invoice.user_id, invoice.reviewed_by].filter(Boolean);
    let usersMap = {};
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, full_name")
        .in("id", userIds);
      
      if (!usersError && users) {
        users.forEach(u => {
          usersMap[u.id] = u;
        });
      }
    }

    // Convert file_data to base64 for frontend
    let fileDataBase64 = null;
    if (invoice.file_data) {
      // PostgreSQL BYTEA is returned as Buffer in Node.js
      fileDataBase64 = Buffer.from(invoice.file_data).toString("base64");
    }
    
    res.json({
      ...invoice,
      user_email: usersMap[invoice.user_id]?.email,
      user_name: usersMap[invoice.user_id]?.full_name,
      reviewer_email: usersMap[invoice.reviewed_by]?.email,
      reviewer_name: usersMap[invoice.reviewed_by]?.full_name,
      file_data_base64: fileDataBase64,
      extracted_data:
        typeof invoice.extracted_data === "string"
          ? JSON.parse(invoice.extracted_data)
          : invoice.extracted_data,
    });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update invoice (manual entry/edit)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      invoice_number,
      e_tax_status,
      cust_code,
      pages,
      currency,
      payment_method,
      net_total,
      delivery_instructions,
      payment_received_by,
      received_by_signature,
      delivered_by_signature,
      has_signatures,
    } = req.body;

    // Compute has_signatures if not provided: "Yes" if either signature is "Yes"
    let computedHasSignatures = has_signatures;
    if (!computedHasSignatures) {
      if (received_by_signature === "Yes" || delivered_by_signature === "Yes") {
        computedHasSignatures = "Yes";
      } else {
        computedHasSignatures = "No";
      }
    }

    // Check if invoice exists
    const { data: invoices, error: fetchError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (fetchError || !invoices) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // If invoice number is being changed, check if new number already exists (allow if cancelled)
    if (invoice_number && invoice_number !== invoices.invoice_number) {
      const { data: existing, error: checkError } = await supabase
        .from("invoices")
        .select("*")
        .eq("invoice_number", invoice_number)
        .neq("id", id) // Exclude current invoice
        .limit(1);

      if (checkError) {
        console.error("Check invoice error:", checkError);
        return res.status(500).json({ error: "Server error" });
      }

      if (existing && existing.length > 0) {
        const existingInvoice = existing[0];
        // Allow if the existing invoice is cancelled
        if (existingInvoice.status !== "cancelled") {
          return res.status(400).json({ 
            error: "Invoice number already exists",
            details: `An invoice with this number already exists with status: ${existingInvoice.status}`
          });
        }
      }
    }

    // Build extracted_data object
    const extractedData = {
      e_tax_status: e_tax_status || null,
      invoice_number: invoice_number || invoices.invoice_number,
      cust_code: cust_code || null,
      pages: pages || null,
      currency: currency || null,
      payment_method: payment_method || null,
      net_total: net_total || null,
      delivery_instructions: delivery_instructions || null,
      payment_received_by: payment_received_by || null,
      received_by_signature: received_by_signature || null,
      delivered_by_signature: delivered_by_signature || null,
      has_signatures: computedHasSignatures || null,
    };

    // Prepare update data
    const updateData = {
      invoice_number: invoice_number || invoices.invoice_number,
      corner_number: null,
      e_tax_status,
      cust_code,
      pages,
      currency,
      payment_method,
      net_total: net_total ? parseFloat(net_total) : null,
      delivery_instructions,
      payment_received_by,
      has_signatures: computedHasSignatures || null,
      extracted_data: extractedData,
      status: "review",
    };

    // Add signature fields only if provided
    if (received_by_signature !== undefined) {
      updateData.received_by_signature = received_by_signature || null;
    }
    if (delivered_by_signature !== undefined) {
      updateData.delivered_by_signature = delivered_by_signature || null;
    }

    const { error: updateError } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      console.error("Update invoice error:", updateError);
      return res.status(500).json({ error: "Server error" });
    }

    // Update JSON and XML files
    const invoiceNum = invoice_number || invoices.invoice_number;
    const jsonDir = path.join(__dirname, "../exports/json");
    const xmlDir = path.join(__dirname, "../exports/xml");

    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
    if (!fs.existsSync(xmlDir)) fs.mkdirSync(xmlDir, { recursive: true });

    fs.writeFileSync(
      path.join(jsonDir, `${invoiceNum}.json`),
      JSON.stringify(extractedData, null, 2),
      "utf8"
    );

    fs.writeFileSync(
      path.join(xmlDir, `${invoiceNum}.xml`),
      buildXml(extractedData),
      "utf8"
    );

    res.json({ message: "Invoice updated successfully" });
  } catch (error) {
    console.error("Update invoice error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Review invoice (supervisor/admin only)
router.post(
  "/:id/review",
  authenticate,
  authorize("supervisor", "admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { action, comments } = req.body; // action: 'approve' or 'reject'

      if (!["approve", "reject"].includes(action)) {
        return res
          .status(400)
          .json({ error: 'Invalid action. Use "approve" or "reject"' });
      }

      const status = action === "approve" ? "approved" : "rejected";

      const { error } = await supabase
        .from("invoices")
        .update({
          status,
          reviewed_by: req.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Review invoice error:", error);
        return res.status(500).json({ error: "Server error" });
      }

      res.json({ message: `Invoice ${action}d successfully` });
    } catch (error) {
      console.error("Review invoice error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Cancel invoice
router.post("/:id/cancel", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("invoices")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      console.error("Cancel invoice error:", error);
      return res.status(500).json({ error: "Server error" });
    }

    res.json({ message: "Invoice cancelled successfully" });
  } catch (error) {
    console.error("Cancel invoice error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Download file
router.get("/:id/file", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("file_name, file_type, file_data")
      .eq("id", id)
      .limit(1)
      .single();

    if (error || !invoices) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.setHeader(
      "Content-Type",
      invoices.file_type === "image" ? "image/jpeg" : "application/pdf"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${invoices.file_name}"`
    );
    
    // PostgreSQL BYTEA is returned as Buffer
    const fileBuffer = Buffer.from(invoices.file_data);
    res.send(fileBuffer);
  } catch (error) {
    console.error("Download file error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
