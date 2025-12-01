// Check for common server errors
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log("🔍 Checking Server Configuration\n");
console.log("=" .repeat(50));

// Check environment variables
console.log("\n1️⃣ Environment Variables:");
console.log("   SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
console.log("   SUPABASE_ANON_KEY:", supabaseKey ? "✅ Set" : "❌ Missing");
console.log("   JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing");

if (!supabaseUrl || !supabaseKey) {
  console.log("\n❌ Missing Supabase configuration!");
  process.exit(1);
}

// Check database connection
console.log("\n2️⃣ Database Connection:");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    // Check if invoices table exists and has required columns
    const { data: testInvoice, error: testError } = await supabase
      .from("invoices")
      .select("id, invoice_number, received_by_signature, delivered_by_signature, has_signatures")
      .limit(1);
    
    if (testError) {
      console.log("❌ Database Error:", testError.message);
      
      if (testError.message.includes("column") && testError.message.includes("does not exist")) {
        console.log("\n💡 Missing database columns!");
        console.log("   → Run: update_signature_fields.sql in Supabase SQL Editor");
      }
      
      if (testError.message.includes("unique constraint")) {
        console.log("\n💡 Database constraint issue!");
        console.log("   → Run: remove_invoice_number_unique.sql in Supabase SQL Editor");
      }
    } else {
      console.log("✅ Database connection OK");
      console.log("✅ Table structure OK");
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("✅ Configuration check complete!");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("   Stack:", error.stack);
  }
})();



