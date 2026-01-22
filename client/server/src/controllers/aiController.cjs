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
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            systemInstruction: "You are a professional resume writer and career coach. Your goal is to rewrite resume content to be high-impact, professional, and ATS-optimized. You must return ONLY the rewritten text itself. Never include conversational prefixes, quotes, markdown formatting, or explanations."
        });

        let userPrompt = "";
        if (type === 'experience') {
            userPrompt = `Rewrite this resume work experience bullet point. Use strong action verbs, focus on achievements, and quantify results if possible. Keep it to one concise line. Input: "${text}"`;
        } else if (type === 'summary') {
            userPrompt = `Compose a high-impact professional summary (approximately 3 lines) based on these skills and experiences. Use a confident, executive tone. Input: "${text}"`;
        } else if (type === 'skills') {
            userPrompt = `Organize these technical skills into logical categories (e.g., Languages, Frameworks, Tools). Format as category names followed by a comma-separated list. Input: "${text}"`;
        } else {
            userPrompt = `Refine this professional text for a resume, improving grammar, tone, and impact. Input: "${text}"`;
        }

        const result = await model.generateContent(userPrompt);
        const responseText = await result.response;

        let enhancedText = responseText.text()
            .trim()
            .replace(/^["'«„](.*)["'»“]$/g, '$1') // Remove various types of quotes
            .replace(/\*\*/g, '') // Remove markdown bold
            .replace(/[*#]/g, '') // Remove bullet points or headers
            .trim();

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
