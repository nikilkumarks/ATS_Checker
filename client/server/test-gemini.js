const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // There isn't a direct listModels method on the client instance in some versions, 
        // but let's try to access it if possible or infer it. 
        // Actually the error message suggests calling ListModels.
        // In Node SDK, it's often not directly exposed easily on the main entry point in older versions, 
        // but let's try a simple generation on 'gemini-1.5-flash-latest' which is a common alias.

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("Test");
        console.log("Success with gemini-1.5-flash-latest");
    } catch (e) {
        console.log("Failed with gemini-1.5-flash-latest: " + e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        await model.generateContent("Test");
        console.log("Success with gemini-pro");
    } catch (e) {
        console.log("Failed with gemini-pro: " + e.message);
    }
}

listModels();
