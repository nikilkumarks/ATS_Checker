const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGeminiAPI() {
    console.log("🔍 Testing Gemini API Connection...\n");

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY not found in .env file");
        return;
    }

    console.log("✓ API Key found:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-pro"
        });

        console.log("✓ Model initialized successfully");
        console.log("🚀 Sending test request...\n");

        const result = await model.generateContent("Say 'Hello, API is working!' in a professional tone.");
        const response = await result.response;
        const text = response.text();

        console.log("✅ SUCCESS! API Response:");
        console.log("─".repeat(50));
        console.log(text);
        console.log("─".repeat(50));
        console.log("\n✓ Gemini API is working correctly!");

    } catch (error) {
        console.error("\n❌ API Test Failed:");
        console.error("Error Type:", error.constructor.name);
        console.error("Error Message:", error.message);

        if (error.message.includes("API key")) {
            console.error("\n💡 Solution: Check if your API key is valid");
            console.error("   Get a new key at: https://aistudio.google.com/app/apikey");
        } else if (error.message.includes("quota")) {
            console.error("\n💡 Solution: You may have exceeded the API quota");
            console.error("   Wait a few minutes or check your quota limits");
        } else if (error.message.includes("404") || error.message.includes("model")) {
            console.error("\n💡 Solution: The model name might be incorrect");
            console.error("   Try using 'gemini-1.5-flash' or 'gemini-pro'");
        } else {
            console.error("\n💡 Full error details:");
            console.error(error);
        }
    }
}

testGeminiAPI();
