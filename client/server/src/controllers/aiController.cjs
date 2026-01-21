const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

exports.enhanceText = async (req, res) => {
    const { text, type } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text is required" });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Try the latest flash model first
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        let prompt = "";
        if (type === 'experience') {
            prompt = `Rewrite this resume bullet point to be impactful, using action verbs and metrics if possible: "${text}"`;
        } else if (type === 'summary') {
            prompt = `Rewrite this professional summary to be concise, engaging, and highlighting expertise: "${text}"`;
        } else {
            prompt = `Improve the grammar and professional tone of: "${text}"`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedText = response.text();

        return res.json({ enhancedText });

    } catch (err) {
        console.error("AI API Failed (Fallout to Mock):", err.message);

        // Fallback: Simple heuristic "enhancement" so the UI doesn't break
        let mockEnhanced = text;
        if (type === 'experience') {
            mockEnhanced = `Spearheaded usage of ${text.split(' ').slice(0, 3).join(' ')} to drive efficiency and optimize performance.`;
        } else if (type === 'summary') {
            mockEnhanced = `Results-oriented professional with expertise in ${text.split(' ').slice(0, 3).join(' ')}, dedicated to driving organizational success.`;
        } else {
            mockEnhanced = `[Polished] ${text}`;
        }

        // Return success with mock data but log it on server
        return res.json({
            enhancedText: mockEnhanced,
            warning: "AI service unavailable, using simulated enhancement."
        });
    }
};
