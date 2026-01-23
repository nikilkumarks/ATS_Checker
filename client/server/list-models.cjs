const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    console.log("🔍 Listing Available Gemini Models...\n");

    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY not found");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const models = await genAI.listModels();

        console.log("✅ Available Models:");
        console.log("─".repeat(60));

        for await (const model of models) {
            console.log(`\n📦 ${model.name}`);
            console.log(`   Display Name: ${model.displayName}`);
            console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        }

        console.log("\n" + "─".repeat(60));

    } catch (error) {
        console.error("\n❌ Error:", error.message);
        console.error("\n💡 This might mean:");
        console.error("   1. Your API key is invalid or expired");
        console.error("   2. You need to enable the Gemini API");
        console.error("   3. There's a network issue");
        console.error("\n🔗 Get a new API key at: https://aistudio.google.com/app/apikey");
    }
}

listModels();
