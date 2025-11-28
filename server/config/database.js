const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const DEFAULT_PROMPT_NAME = "Default Invoice Extraction Prompt";
const DEFAULT_PROMPT_INSTRUCTIONS = `Prompt for Reading Invoice Documents (Vertical Table Format)

Read the attached document carefully, every character and every number.
Then extract the information according to the steps below.
Finally, summarize the results in a vertical table format (header on the left, values on the right).

Instructions for Data Extraction

1 Check the corner of the paper
Please read the attached image and extract the number that appears after the text "No." 
• The number may be written as 01, 13, 124, 134, 1234, etc.
• Only extract the numeric value following "No." (without any letters or spaces).
• If there is no number, return it as an empty value.

2 Look for the text "E-TAX" above the barcode
→ If "E-TAX" is not found, write "Non E-TAX".
→ If it appears, write "E-TAX".

3 Read the Invoice Number (Critical data)
→ Usually found near the barcode or invoice header.

4 Read the value of "CUST CODE"
→ Extract the CUST CODE from the image exactly as printed.
Do not modify or correct any characters.
Do not guess unclear text.
Return the value exactly as seen, character for character.

5 Check the "PAGES" section
→ Record it (e.g., 1/1, 2/2, 3/3, etc.) and note if it's the last page.

6 Read the values of "CURRENCY" and "PAYMENT METHOD"

7 Find the Net Total (Total Amount)
→ Record the exact number shown on the document.

8 Look for the "Delivery Instructions" section
→ Write down all the text that appears under this header. * Please be careful when reading, as it is in Thai. It needs to sound natural, like a native speaker, without any distortion

9 Check Keyword "ชำระเงินโดย" section
→Please analyze the attached image and extract payment information according to the following rules:
1. Identify which checkbox is ticked (เงินสด / บัตรเครดิต / เงินโอน / เช็ค).
2. If "เงินโอน" is selected, extract the text written after it.
3. If "เช็ค" is selected, extract the "เลขที่เช็ค" (cheque number) and "วันที่เช็ค" (cheque date).
4. Always extract the "จำนวนเงิน" (amount of money) if it is written.

10 Check for signatures and dates at RECEIVED BY
→ If present, write "Yes".
→ If absent, write "No".

11 Check for signatures and dates at DELIVERY BY
→ If present, write "Yes".
→ If absent, write "No".

IMPORTANT: You MUST return ONLY valid JSON format with ALL fields. Do not include any text before or after the JSON. Use this exact structure:

{
  "e_tax_status": "",
  "invoice_number": "",
  "cust_code": "",
  "pages": "",
  "currency": "",
  "payment_method": "",
  "net_total": "",
  "delivery_instructions": "",
  "payment_received_by": "",
  "has_signatures": ""
}

If a field cannot be found, use an empty string "". Do not omit any fields.`;

const defaultPromptPayload = JSON.stringify({
  instructions: DEFAULT_PROMPT_INSTRUCTIONS,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Th@1land",
  database: process.env.DB_NAME || "SynnexInvoiceExtractor_cursor",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  collation: "utf8mb4_unicode_ci",
});

// Initialize database and tables
async function initializeDatabase() {
  try {
    // Create database if not exists
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "Th@1land",
      charset: "utf8mb4",
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${
        process.env.DB_NAME || "SynnexInvoiceExtractor_cursor"
      } 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.end();

    // Create tables
    await createTables();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

async function createTables() {
  const connection = await pool.getConnection();

  try {
    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role ENUM('pending', 'user', 'supervisor', 'admin') DEFAULT 'pending',
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Invoices table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(255) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_data LONGBLOB,
        file_path VARCHAR(500),
        corner_number VARCHAR(50),
        e_tax_status VARCHAR(50),
        cust_code VARCHAR(255),
        pages VARCHAR(50),
        currency VARCHAR(50),
        payment_method VARCHAR(100),
        net_total DECIMAL(15, 2),
        delivery_instructions TEXT,
        payment_received_by VARCHAR(100),
        has_signatures VARCHAR(10),
        extracted_data JSON,
        status ENUM('pending', 'review', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
        reviewed_by INT,
        reviewed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Prompts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        prompt_text TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Insert default prompt
    const [prompts] = await connection.query(
      "SELECT * FROM prompts WHERE is_active = TRUE LIMIT 1"
    );
    if (prompts.length === 0) {
      const defaultPrompt = {
        name: DEFAULT_PROMPT_NAME,
        prompt_text: defaultPromptPayload,
        is_active: true,
      };
      await connection.query("INSERT INTO prompts SET ?", [defaultPrompt]);
    } else {
      await connection.query(
        "UPDATE prompts SET prompt_text = ?, updated_at = NOW() WHERE name = ?",
        [defaultPromptPayload, DEFAULT_PROMPT_NAME]
      );
    }
    // Create admin user if not exists
    const bcrypt = require("bcryptjs");
    const [admins] = await connection.query(
      "SELECT * FROM users WHERE role = 'admin' LIMIT 1"
    );
    if (admins.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await connection.query(
        "INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)",
        ["admin@synnex.com", hashedPassword, "System Administrator", "admin"]
      );
    }
  } catch (error) {
    console.error("Table creation error:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Initialize on module load
initializeDatabase();

module.exports = pool;
