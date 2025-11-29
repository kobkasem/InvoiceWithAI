// Test login directly with Supabase
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase configuration");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log("🧪 Testing Login Process\n");
  console.log("=" .repeat(50));
  
  try {
    // Step 1: Find user
    console.log("\n1️⃣ Looking for user: kasem_u@synnex.co.th");
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "kasem_u@synnex.co.th")
      .limit(1);
    
    if (fetchError) {
      console.error("❌ Error fetching user:", fetchError);
      console.error("   Code:", fetchError.code);
      console.error("   Message:", fetchError.message);
      console.error("   Details:", fetchError.details);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log("❌ User not found!");
      console.log("   → Creating admin user...");
      
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          email: "kasem_u@synnex.co.th",
          password: hashedPassword,
          full_name: "System Administrator",
          role: "admin",
          status: "active",
        })
        .select()
        .single();
      
      if (createError) {
        console.error("❌ Error creating user:", createError);
        return;
      }
      
      console.log("✅ Admin user created!");
      console.log("   Email:", newUser.email);
      console.log("   Role:", newUser.role);
      return;
    }
    
    const user = users[0];
    console.log("✅ User found:");
    console.log("   Email:", user.email);
    console.log("   Role:", user.role);
    console.log("   Status:", user.status);
    console.log("   Has password:", !!user.password);
    
    // Step 2: Check password
    console.log("\n2️⃣ Testing password: admin123");
    const isMatch = await bcrypt.compare("admin123", user.password);
    
    if (isMatch) {
      console.log("✅ Password matches!");
    } else {
      console.log("❌ Password does NOT match!");
      console.log("   → Resetting password...");
      
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const { error: updateError } = await supabase
        .from("users")
        .update({ password: hashedPassword })
        .eq("id", user.id);
      
      if (updateError) {
        console.error("❌ Error updating password:", updateError);
      } else {
        console.log("✅ Password reset successfully!");
      }
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("✅ Login test completed!");
    
  } catch (error) {
    console.error("\n❌ Unexpected error:", error);
    console.error("   Stack:", error.stack);
  }
}

testLogin();

