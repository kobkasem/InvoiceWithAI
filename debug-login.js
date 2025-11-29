// Debug Login Issue
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase configuration");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLogin() {
  console.log("🔍 Debugging Login Process\n");
  console.log("=" .repeat(50));
  
  const email = "kasem_u@synnex.co.th";
  const password = "admin123";
  
  try {
    console.log("\n1️⃣ Finding user...");
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);
    
    if (fetchError) {
      console.error("❌ Supabase Error:", fetchError);
      console.error("   Code:", fetchError.code);
      console.error("   Message:", fetchError.message);
      console.error("   Details:", fetchError.details);
      console.error("   Hint:", fetchError.hint);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log("❌ User not found!");
      return;
    }
    
    const user = users[0];
    console.log("✅ User found:", user.email);
    console.log("   ID:", user.id);
    console.log("   Role:", user.role);
    console.log("   Status:", user.status);
    console.log("   Password hash exists:", !!user.password);
    
    console.log("\n2️⃣ Checking password...");
    if (!user.password) {
      console.log("❌ User has no password!");
      return;
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("   Password match:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Password doesn't match!");
      return;
    }
    
    console.log("\n3️⃣ Generating JWT token...");
    try {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      console.log("✅ Token generated successfully!");
      console.log("   Token length:", token.length);
      console.log("   Token preview:", token.substring(0, 50) + "...");
    } catch (jwtError) {
      console.error("❌ JWT Error:", jwtError.message);
      console.error("   JWT_SECRET exists:", !!JWT_SECRET);
      return;
    }
    
    console.log("\n✅ All checks passed! Login should work.");
    console.log("\n" + "=".repeat(50));
    console.log("💡 If login still fails, check server console logs");
    console.log("   for the actual error message.");
    
  } catch (error) {
    console.error("\n❌ Unexpected error:", error);
    console.error("   Message:", error.message);
    console.error("   Stack:", error.stack);
  }
}

debugLogin();

