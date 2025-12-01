// Verify OpenAI API Key Configuration
require("dotenv").config();

console.log("🔍 Checking OpenAI API Key Configuration\n");
console.log("=" .repeat(50));

const apiKey = process.env.OPENAI_API_KEY;

console.log("\n1️⃣ Checking .env file...");

if (!apiKey) {
  console.log("❌ OPENAI_API_KEY is not set in .env");
  console.log("   → Add OPENAI_API_KEY=your-key-here to .env file");
  process.exit(1);
}

console.log("✅ OPENAI_API_KEY is set");

console.log("\n2️⃣ Checking API key value...");

if (apiKey === "your-openai-api-key-here") {
  console.log("❌ Still using placeholder value!");
  console.log("   → Update .env file with your real API key");
  console.log("   → Get key from: https://platform.openai.com/account/api-keys");
  process.exit(1);
}

if (apiKey.includes("your-ope")) {
  console.log("❌ Still using placeholder value!");
  console.log("   → Update .env file with your real API key");
  process.exit(1);
}

if (!apiKey.startsWith("sk-")) {
  console.log("⚠️  Warning: API key doesn't start with 'sk-'");
  console.log("   → Make sure you copied the full key");
  console.log("   → Key preview:", apiKey.substring(0, 20) + "...");
} else {
  console.log("✅ API key format looks correct");
  console.log("   Key preview:", apiKey.substring(0, 20) + "...");
}

console.log("\n3️⃣ Testing OpenAI client initialization...");

try {
  const { OpenAI } = require("openai");
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  console.log("✅ OpenAI client initialized successfully");
} catch (error) {
  console.log("❌ Error initializing OpenAI client:", error.message);
  process.exit(1);
}

console.log("\n" + "=".repeat(50));
console.log("✅ API Key Configuration is correct!");
console.log("\n💡 Next Steps:");
console.log("   1. Make sure server is restarted after updating .env");
console.log("   2. Try uploading an invoice");
console.log("   3. If still getting errors, check server console logs");



