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
            prompt = `As an expert resume writer and recruiter, rewrite the following resume work experience bullet point to be extremely impactful, professional, and ATS-optimized. Use strong action verbs, quantify achievements with metrics (use placeholders like [X%] if not provided), and align it with industry standards: "${text}"`;
        } else if (type === 'summary') {
            prompt = `Write a premium, high-impact professional summary (3-4 lines) based on the following information. Ensure it highlights key strengths, uses professional industry keywords, and sounds authoritative yet humble: "${text}"`;
        } else if (type === 'skills') {
            prompt = `Organize and optimize the following skills for a resume. Group them logically (e.g., Languages, Frameworks, Tools) and format them cleanly. Remove repetitions and ensure they look professional: "${text}"`;
        } else {
            prompt = `Critically analyze and refine the following text for a professional resume. Improve grammar, vocabulary, and overall corporate tone: "${text}"`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedText = response.text().trim().replace(/^"(.*)"$/, '$1'); // Clean up quotes if any

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
