const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testWithV1() {
    console.log("🔍 Testing with different API configurations...\n");

    try {
        // Try with explicit API version
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const prompt = "Rewrite this for a resume: I worked on projects";
        console.log(`Prompt: "${prompt}"\n`);

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log("✅ SUCCESS!");
        console.log("─".repeat(60));
        console.log("Response:", text);
        console.log("─".repeat(60));

    } catch (error) {
        console.error("\n❌ Error Details:");
        console.error("Message:", error.message);
        console.error("\nFull Error:");
        console.error(error);

        console.log("\n💡 Troubleshooting:");
        console.log("1. Make sure you've enabled the Gemini API in Google Cloud Console");
        console.log("2. Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com");
        console.log("3. Click 'Enable' if not already enabled");
        console.log("4. Or create a new API key at: https://aistudio.google.com/app/apikey");
    }
}

testWithV1();
