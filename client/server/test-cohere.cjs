const { CohereClient } = require("cohere-ai");
require("dotenv").config();

async function testCohereAPI() {
    console.log("🔍 Testing Cohere AI API Connection...\n");

    // Check if API key exists
    if (!process.env.COHERE_API_KEY || process.env.COHERE_API_KEY === 'your_cohere_api_key_here') {
        console.error("❌ COHERE_API_KEY not found or not configured in .env file");
        return;
    }

    console.log("✓ API Key found:", process.env.COHERE_API_KEY.substring(0, 10) + "...");

    try {
        const cohere = new CohereClient({
            token: process.env.COHERE_API_KEY,
        });

        console.log("✓ Client initialized successfully");
        console.log("🚀 Sending test request...\n");

        const response = await cohere.chat({
            model: "command-r-08-2024",
            message: "Say 'Hello, Cohere API is working!' in a professional tone.",
        });

        console.log("✅ SUCCESS! API Response:");
        console.log("─".repeat(50));
        console.log(response.text);
        console.log("─".repeat(50));
        console.log("\n✓ Cohere API is working correctly!");

    } catch (error) {
        console.error("\n❌ API Test Failed:");
        console.error("Error Message:", error.message);
        console.error("\n💡 Solution: Check if your API key is valid and you have access to the model.");
    }
}

testCohereAPI();
