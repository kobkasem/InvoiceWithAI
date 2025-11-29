// Test Login Endpoint
require("dotenv").config();
const axios = require("axios");

const API_URL = process.env.PORT ? `http://localhost:${process.env.PORT}` : "http://localhost:5000";

console.log("🧪 Testing Login Endpoint\n");
console.log("=" .repeat(50));

const testLogin = async () => {
  try {
    console.log("\n📤 Sending login request...");
    console.log("   Email: kasem_u@synnex.co.th");
    console.log("   Password: admin123");
    console.log("   Endpoint:", `${API_URL}/api/auth/login`);
    
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: "kasem_u@synnex.co.th",
      password: "admin123"
    }, {
      timeout: 5000,
      validateStatus: () => true // Don't throw on any status
    });
    
    console.log("\n📥 Response Status:", response.status);
    console.log("📥 Response Data:", JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log("\n✅ Login successful!");
      console.log("   Token received:", response.data.token ? "Yes" : "No");
      console.log("   User:", response.data.user?.email);
    } else {
      console.log("\n❌ Login failed!");
      console.log("   Error:", response.data.error || "Unknown error");
    }
    
  } catch (error) {
    console.log("\n❌ Request failed!");
    if (error.code === "ECONNREFUSED") {
      console.log("   → Backend server is not running!");
      console.log("   → Start server with: npm run dev");
    } else if (error.code === "ETIMEDOUT") {
      console.log("   → Request timed out");
      console.log("   → Check if server is running on port 5000");
    } else {
      console.log("   Error:", error.message);
      if (error.response) {
        console.log("   Status:", error.response.status);
        console.log("   Data:", error.response.data);
      }
    }
  }
};

testLogin();

