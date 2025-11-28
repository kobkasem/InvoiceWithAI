const pool = require("../server/config/database");
const fs = require("fs");
const path = require("path");

async function clearAllInvoiceData() {
  try {
    console.log("Starting invoice data cleanup...");

    // 1. Delete all invoices from database
    console.log("Deleting invoices from database...");
    const [result] = await pool.query("DELETE FROM invoices");
    console.log(`Deleted ${result.affectedRows} invoice(s) from database`);

    // 2. Delete all uploaded files
    const uploadsDir = path.join(__dirname, "../server/uploads");
    if (fs.existsSync(uploadsDir)) {
      console.log("Deleting uploaded files...");
      const files = fs.readdirSync(uploadsDir);
      let deletedCount = 0;
      files.forEach((file) => {
        const filePath = path.join(uploadsDir, file);
        try {
          fs.unlinkSync(filePath);
          deletedCount++;
        } catch (error) {
          console.error(`Error deleting file ${file}:`, error.message);
        }
      });
      console.log(`Deleted ${deletedCount} uploaded file(s)`);
    }

    // 3. Delete all JSON export files
    const jsonDir = path.join(__dirname, "../server/exports/json");
    if (fs.existsSync(jsonDir)) {
      console.log("Deleting JSON export files...");
      const files = fs.readdirSync(jsonDir);
      let deletedCount = 0;
      files.forEach((file) => {
        const filePath = path.join(jsonDir, file);
        try {
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch (error) {
          console.error(`Error deleting file ${file}:`, error.message);
        }
      });
      console.log(`Deleted ${deletedCount} JSON file(s)`);
    }

    // 4. Delete all XML export files
    const xmlDir = path.join(__dirname, "../server/exports/xml");
    if (fs.existsSync(xmlDir)) {
      console.log("Deleting XML export files...");
      const files = fs.readdirSync(xmlDir);
      let deletedCount = 0;
      files.forEach((file) => {
        const filePath = path.join(xmlDir, file);
        try {
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch (error) {
          console.error(`Error deleting file ${file}:`, error.message);
        }
      });
      console.log(`Deleted ${deletedCount} XML file(s)`);
    }

    console.log("Invoice data cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

clearAllInvoiceData();




