// Reset Admin Password Script
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase configuration in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetAdminPassword() {
  console.log("🔐 Resetting Admin Password...\n");
  
  try {
    // Hash the password
    const newPassword = "admin123";
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log("📝 Updating password for kasem_u@synnex.co.th...");
    
    // Update password
    const { data, error } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("email", "kasem_u@synnex.co.th")
      .select();
    
    if (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
    
    if (!data || data.length === 0) {
      console.log("❌ Admin user not found!");
      console.log("   Creating admin user...");
      
      // Create admin user
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          email: "kasem_u@synnex.co.th",
          password: hashedPassword,
          full_name: "System Administrator",
          role: "admin",
          status: "active",
        })
        .select();
      
      if (createError) {
        console.error("❌ Error creating user:", createError.message);
        process.exit(1);
      }
      
      console.log("✅ Admin user created successfully!");
      console.log("   Email: kasem_u@synnex.co.th");
      console.log("   Password: admin123");
    } else {
      console.log("✅ Password reset successfully!");
      console.log("   Email: kasem_u@synnex.co.th");
      console.log("   Password: admin123");
    }
    
    console.log("\n🎉 Done! You can now login with:");
    console.log("   Email: kasem_u@synnex.co.th");
    console.log("   Password: admin123");
    
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
    process.exit(1);
  }
}

resetAdminPassword();

