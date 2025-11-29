// System Diagnostic Script
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

console.log("🔍 System Diagnostic Check\n");
console.log("=" .repeat(50));

// Check 1: Environment Variables
console.log("\n1️⃣ Checking Environment Variables...");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.log("❌ SUPABASE_URL is missing in .env");
} else {
  console.log("✅ SUPABASE_URL:", supabaseUrl);
}

if (!supabaseKey) {
  console.log("❌ SUPABASE_ANON_KEY is missing in .env");
} else {
  console.log("✅ SUPABASE_ANON_KEY:", supabaseKey.substring(0, 20) + "...");
}

// Check 2: Supabase Connection
console.log("\n2️⃣ Testing Supabase Connection...");
if (!supabaseUrl || !supabaseKey) {
  console.log("❌ Cannot test connection - missing credentials");
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test connection by checking if users table exists
  supabase
    .from("users")
    .select("count", { count: "exact", head: true })
    .then(({ count, error }) => {
      if (error) {
        console.log("❌ Connection Error:", error.message);
        if (error.message.includes("relation") || error.message.includes("does not exist")) {
          console.log("⚠️  Database tables don't exist!");
          console.log("   → Run supabase_schema.sql in Supabase SQL Editor");
        }
      } else {
        console.log("✅ Connected to Supabase successfully");
        console.log("   Users table exists");
      }
      
      // Check 3: Check if admin user exists
      console.log("\n3️⃣ Checking Admin User...");
      supabase
        .from("users")
        .select("*")
        .eq("email", "kasem_u@synnex.co.th")
        .limit(1)
        .then(({ data, error }) => {
          if (error) {
            console.log("❌ Error checking admin user:", error.message);
          } else if (!data || data.length === 0) {
            console.log("❌ Admin user does NOT exist");
            console.log("   → The admin user should be created automatically when server starts");
            console.log("   → Make sure server has been started at least once");
          } else {
            const admin = data[0];
            console.log("✅ Admin user exists:");
            console.log("   Email:", admin.email);
            console.log("   Role:", admin.role);
            console.log("   Status:", admin.status);
            console.log("   ID:", admin.id);
            
            if (admin.status !== "active") {
              console.log("⚠️  WARNING: Admin user status is not 'active'!");
              console.log("   → This will prevent login");
            }
          }
          
          console.log("\n" + "=".repeat(50));
          console.log("\n📋 Summary:");
          console.log("1. Check if .env file has correct Supabase credentials");
          console.log("2. Verify database tables exist in Supabase");
          console.log("3. Make sure server has been started (creates admin user)");
          console.log("4. Check server console logs for errors");
          console.log("\n💡 Next Steps:");
          console.log("- If tables don't exist: Run supabase_schema.sql");
          console.log("- If admin doesn't exist: Restart the server");
          console.log("- Check server logs for detailed error messages");
        });
    });
}

