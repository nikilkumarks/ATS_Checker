const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testModels() {
    console.log("🔍 Testing Different Gemini Models...\n");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const modelsToTry = [
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-pro",
        "gemini-1.0-pro",
        "models/gemini-pro",
        "models/gemini-1.5-flash"
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`\n📦 Testing: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            const text = response.text();

            console.log(`✅ SUCCESS with ${modelName}!`);
            console.log(`Response: ${text.substring(0, 50)}...`);
            console.log("\n" + "=".repeat(60));
            console.log(`✅ USE THIS MODEL: ${modelName}`);
            console.log("=".repeat(60));
            break;

        } catch (error) {
            console.log(`❌ Failed: ${error.message.substring(0, 80)}...`);
        }
    }
}

testModels();
