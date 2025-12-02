const { createClient } = require("@supabase/supabase-js");
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
→ Look VERY CAREFULLY for handwriting/signature in the "RECEIVED BY" or "Payment Received By" section.
→ Analyze the image to detect if there is actual handwriting (signature) written by hand, not just printed text.
→ If handwriting/signature is clearly present and visible, write "Yes".
→ If absent, only printed text, or no signature visible, write "No".
→ Be precise: only "Yes" if you can clearly see handwritten signature, otherwise "No".

11 Check for signatures and dates at DELIVERED BY (or DELIVERY BY)
→ Look VERY CAREFULLY for handwriting/signature in the "DELIVERED BY" or "DELIVERY BY" or "Delivery By" section.
→ Analyze the image to detect if there is actual handwriting (signature) written by hand, not just printed text.
→ If handwriting/signature is clearly present and visible, write "Yes".
→ If absent, only printed text, or no signature visible, write "No".
→ Be precise: only "Yes" if you can clearly see handwritten signature, otherwise "No".

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
  "received_by_signature": "",
  "delivered_by_signature": "",
  "has_signatures": ""
}

Note: 
- received_by_signature: Check "RECEIVED BY" section for handwriting/signature
- delivered_by_signature: Check "DELIVERED BY" or "DELIVERY BY" section for handwriting/signature
- has_signatures: Set to "Yes" if EITHER received_by_signature OR delivered_by_signature is "Yes", otherwise "No"

If a field cannot be found, use an empty string "". Do not omit any fields.`;

const defaultPromptPayload = JSON.stringify({
  instructions: DEFAULT_PROMPT_INSTRUCTIONS,
});

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️  Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.");
  console.error("Current SUPABASE_URL:", supabaseUrl ? "Set" : "NOT SET");
  console.error("Current SUPABASE_ANON_KEY:", supabaseKey ? "Set" : "NOT SET");
  console.error("⚠️  Server will start but database features will not work until variables are set.");
  console.error("⚠️  Add variables in Railway Dashboard → Variables tab, then redeploy.");
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase client initialized successfully");
  } catch (error) {
    console.error("❌ Error creating Supabase client:", error.message);
    console.error("⚠️  Server will start but database features will not work.");
  }
}

// Initialize database and tables
async function initializeDatabase() {
  if (!supabase) {
    console.warn("⚠️  Skipping database initialization - Supabase not configured");
    return;
  }
  
  try {
    // Check if tables exist and create them if needed
    await createTables();
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
}

async function createTables() {
  try {
    // Note: Tables should be created via Supabase SQL Editor or migrations
    // This function ensures default data exists
    
    // Check if default prompt exists
    const { data: existingPrompts, error: promptError } = await supabase
      .from("prompts")
      .select("*")
      .eq("is_active", true)
      .limit(1);

    if (promptError && promptError.code !== "PGRST116") {
      // PGRST116 means table doesn't exist - that's OK, will be created via SQL
      console.log("Note: Prompts table may need to be created via Supabase SQL Editor");
    }

    if (!existingPrompts || existingPrompts.length === 0) {
      // Insert default prompt if table exists
      const { error: insertError } = await supabase
        .from("prompts")
        .insert({
          name: DEFAULT_PROMPT_NAME,
          prompt_text: defaultPromptPayload,
          is_active: true,
        });

      if (insertError && insertError.code !== "PGRST116") {
        console.log("Note: Could not insert default prompt. Table may need to be created first.");
      }
    } else {
      // Update existing default prompt
      const { error: updateError } = await supabase
        .from("prompts")
        .update({
          prompt_text: defaultPromptPayload,
          updated_at: new Date().toISOString(),
        })
        .eq("name", DEFAULT_PROMPT_NAME);

      if (updateError && updateError.code !== "PGRST116") {
        console.log("Note: Could not update default prompt.");
      }
    }

    // Check if admin user exists
    const { data: existingAdmins, error: adminError } = await supabase
      .from("users")
      .select("*")
      .eq("role", "admin")
      .limit(1);

    if (adminError && adminError.code !== "PGRST116") {
      console.log("Note: Users table may need to be created via Supabase SQL Editor");
    }

    // Delete old admin account if it exists
    await supabase
      .from("users")
      .delete()
      .eq("email", "admin@synnex.com");

    // Check if new admin exists, create if not
    const { data: newAdmin, error: newAdminError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "kasem_u@synnex.co.th")
      .limit(1);

    if (!newAdmin || newAdmin.length === 0) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          email: "kasem_u@synnex.co.th",
          password: hashedPassword,
          full_name: "System Administrator",
          role: "admin",
        });

      if (insertError && insertError.code !== "PGRST116") {
        console.log("Note: Could not create admin user. Table may need to be created first.");
      } else {
        console.log("Default admin user created: kasem_u@synnex.co.th");
      }
    }
  } catch (error) {
    console.error("Table initialization error:", error);
    // Don't throw - tables might need to be created via SQL Editor
  }
}

// Initialize on module load (non-blocking)
if (supabase) {
  initializeDatabase();
} else {
  console.warn("⚠️  Database module loaded but Supabase not configured");
}

module.exports = supabase;
