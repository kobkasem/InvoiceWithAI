const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../config/database");
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
      has_signatures,
    } = req.body;

    if (!invoice_number) {
      return res.status(400).json({ error: "Invoice number is required" });
    }

    // Check if invoice number already exists
    const [existing] = await pool.query(
      "SELECT * FROM invoices WHERE invoice_number = ?",
      [invoice_number]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Invoice number already exists" });
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
      has_signatures: has_signatures || null,
    };

    // Save to database
    const [result] = await pool.query(
      `INSERT INTO invoices (
        invoice_number, user_id, file_name, file_type, file_data, file_path,
        corner_number, e_tax_status, cust_code, pages, currency, payment_method,
        net_total, delivery_instructions, payment_received_by, has_signatures,
        extracted_data, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_number,
        userId,
        "manual_entry.txt",
        "manual",
        null,
        null,
        null,
        e_tax_status || null,
        cust_code || null,
        pages || null,
        currency || null,
        payment_method || null,
        net_total ? parseFloat(net_total) : null,
        delivery_instructions || null,
        payment_received_by || null,
        has_signatures || null,
        JSON.stringify(extractedData),
        "pending",
      ]
    );

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
      invoice_id: result.insertId,
      invoice_number: invoice_number,
      extracted_data: extractedData,
      json_file: jsonFilePath,
      xml_file: xmlFilePath,
    });
  } catch (error) {
    console.error("Manual entry error:", error);
    res.status(500).json({
      error: "Server error during manual entry",
      details: error.message,
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
      const [prompts] = await pool.query(
        "SELECT * FROM prompts WHERE is_active = TRUE LIMIT 1"
      );

      if (prompts.length === 0) {
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
        await pool.query(
          `INSERT INTO invoices (invoice_number, user_id, file_name, file_type, file_data, file_path, status, extracted_data) 
         VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
          [
            `ERROR_${Date.now()}`,
            userId,
            fileName,
            fileType,
            fileData,
            filePath,
            JSON.stringify({ error: extractionResult.error }),
          ]
        );

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

      // Check if invoice number already exists
      const [existing] = await pool.query(
        "SELECT * FROM invoices WHERE invoice_number = ?",
        [invoiceNumber]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: "Invoice number already exists" });
      }

      // Save to database
      const [result] = await pool.query(
        `INSERT INTO invoices (
        invoice_number, user_id, file_name, file_type, file_data, file_path,
        corner_number, e_tax_status, cust_code, pages, currency, payment_method,
        net_total, delivery_instructions, payment_received_by, has_signatures,
        extracted_data, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          invoiceNumber,
          userId,
          fileName,
          fileType,
          fileData,
          filePath,
          null,
          extractedData.e_tax_status || null,
          extractedData.cust_code || null,
          extractedData.pages || null,
          extractedData.currency || null,
          extractedData.payment_method || null,
          extractedData.net_total ? parseFloat(extractedData.net_total) : null,
          extractedData.delivery_instructions || null,
          extractedData.payment_received_by || null,
          extractedData.has_signatures || null,
          JSON.stringify(extractedData),
          "pending",
        ]
      );

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
        invoice_id: result.insertId,
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

    let query = `
      SELECT i.*, u.email as user_email, u.full_name as user_name,
             r.email as reviewer_email, r.full_name as reviewer_name
      FROM invoices i
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN users r ON i.reviewed_by = r.id
    `;
    const params = [];

    if (status) {
      query += " WHERE i.status = ?";
      params.push(status);
    }

    query += " ORDER BY i.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [invoices] = await pool.query(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM invoices";
    if (status) {
      countQuery += " WHERE status = ?";
    }
    const [countResult] = await pool.query(countQuery, status ? [status] : []);
    const total = countResult[0].total;

    res.json({
      invoices: invoices.map((inv) => ({
        ...inv,
        extracted_data:
          typeof inv.extracted_data === "string"
            ? JSON.parse(inv.extracted_data)
            : inv.extracted_data,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
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

    const [invoices] = await pool.query(
      `SELECT i.*, u.email as user_email, u.full_name as user_name,
              r.email as reviewer_email, r.full_name as reviewer_name
       FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       LEFT JOIN users r ON i.reviewed_by = r.id
       WHERE i.id = ?`,
      [id]
    );

    if (invoices.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const invoice = invoices[0];

    // Convert file_data to base64 for frontend
    let fileDataBase64 = null;
    if (invoice.file_data) {
      fileDataBase64 = invoice.file_data.toString("base64");
    }

    res.json({
      ...invoice,
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
      has_signatures,
    } = req.body;

    // Check if invoice exists
    const [invoices] = await pool.query("SELECT * FROM invoices WHERE id = ?", [
      id,
    ]);
    if (invoices.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Build extracted_data object
    const extractedData = {
      e_tax_status: e_tax_status || null,
      invoice_number: invoice_number || invoices[0].invoice_number,
      cust_code: cust_code || null,
      pages: pages || null,
      currency: currency || null,
      payment_method: payment_method || null,
      net_total: net_total || null,
      delivery_instructions: delivery_instructions || null,
      payment_received_by: payment_received_by || null,
      has_signatures: has_signatures || null,
    };

    await pool.query(
      `UPDATE invoices SET
        invoice_number = ?, corner_number = ?, e_tax_status = ?, cust_code = ?,
        pages = ?, currency = ?, payment_method = ?, net_total = ?,
        delivery_instructions = ?, payment_received_by = ?, has_signatures = ?,
        extracted_data = ?, status = 'review'
      WHERE id = ?`,
      [
        invoice_number || invoices[0].invoice_number,
        null,
        e_tax_status,
        cust_code,
        pages,
        currency,
        payment_method,
        net_total ? parseFloat(net_total) : null,
        delivery_instructions,
        payment_received_by,
        has_signatures,
        JSON.stringify(extractedData),
        id,
      ]
    );

    // Update JSON and XML files
    const invoiceNum = invoice_number || invoices[0].invoice_number;
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

      await pool.query(
        "UPDATE invoices SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?",
        [status, req.user.id, id]
      );

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

    await pool.query("UPDATE invoices SET status = ? WHERE id = ?", [
      "cancelled",
      id,
    ]);

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

    const [invoices] = await pool.query(
      "SELECT file_name, file_type, file_data FROM invoices WHERE id = ?",
      [id]
    );

    if (invoices.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const invoice = invoices[0];

    res.setHeader(
      "Content-Type",
      invoice.file_type === "image" ? "image/jpeg" : "application/pdf"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${invoice.file_name}"`
    );
    res.send(invoice.file_data);
  } catch (error) {
    console.error("Download file error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
