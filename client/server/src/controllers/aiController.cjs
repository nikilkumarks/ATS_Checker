const { CohereClient } = require("cohere-ai");

exports.enhanceText = async (req, res) => {
    const { text, type } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text is required" });
    }

    // Check if API key exists
    if (!process.env.COHERE_API_KEY) {
        console.warn("⚠️ COHERE_API_KEY not configured");
        return useFallback(text, type, res);
    }

    try {
        const cohere = new CohereClient({
            token: process.env.COHERE_API_KEY,
        });

        let userPrompt = "";
        const systemInstruction = "You are a professional resume writer and career coach. Your goal is to rewrite resume content to be high-impact, professional, and ATS-optimized. You must return ONLY the rewritten text itself. Never include conversational prefixes, quotes, markdown formatting, or explanations.";

        if (type === 'experience') {
            userPrompt = `Rewrite these resume work experience bullet points. Use strong action verbs, focus on achievements, and quantify results if possible (e.g., % improvement, $ saved). Ensure each point is professional and ATS-optimized. Maintain the bulleted format if provided. \n\nInput: "${text}"`;
        } else if (type === 'summary') {
            userPrompt = `Compose a high-impact professional summary (2-4 lines) for a resume. Highlight key strengths, years of experience, and career goals. Use a confident, professional tone. \n\nInput keywords/bio: "${text}"`;
        } else if (type === 'skills') {
            userPrompt = `Organize these technical skills into clear, professional categories (e.g., Languages, Frameworks, Tools, Soft Skills). Format it with category titles and bullet points or comma-separated lists. \n\nInput: "${text}"`;
        } else if (type === 'projects') {
            userPrompt = `Enhance this project description for a resume. Focus on the technical implementation, your specific role, and the impact or outcome. Keep it concise and impactful. \n\nInput: "${text}"`;
        } else {
            userPrompt = `Refine this professional text for a resume, improving grammar, tone, and overall impact. Keep it concise and professional. \n\nInput: "${text}"`;
        }

        const response = await cohere.chat({
            model: "command-r-08-2024",
            message: userPrompt,
            preamble: systemInstruction,
        });

        let enhancedText = response.text
            .trim()
            .replace(/^["'«„](.*)[\"'»"]$/g, '$1') // Remove various types of quotes
            .replace(/^(Here is the enhanced text:|Enhanced:|Rewritten:)/i, '') // Remove prefixes
            .replace(/\*\*/g, '') // Remove markdown bold
            .trim();

        console.log(`✅ AI Enhancement successful using Cohere (command-r-08-2024)`);
        return res.json({ enhancedText });

    } catch (err) {
        console.error("❌ Cohere AI API Failed:", err.message);
        return useFallback(text, type, res);
    }
};

// Smart fallback function
function useFallback(text, type, res) {
    let mockEnhanced = text;

    if (type === 'experience') {
        const words = text.split(' ');
        const firstPart = words.slice(0, Math.min(8, words.length)).join(' ');
        mockEnhanced = `• Spearheaded ${firstPart}, driving efficiency and optimizing performance metrics.\n• Collaborated with cross-functional teams to deliver high-quality results and exceed project goals.`;
    } else if (type === 'summary') {
        const words = text.split(' ');
        const keywords = words.slice(0, Math.min(8, words.length)).join(' ');
        mockEnhanced = `Results-oriented professional with expertise in ${keywords}, dedicated to driving organizational success through innovative solutions, strategic thinking, and continuous improvement.`;
    } else if (type === 'projects') {
        const words = text.split(' ');
        const firstPart = words.slice(0, Math.min(8, words.length)).join(' ');
        mockEnhanced = `Developed and deployed ${firstPart}, resulting in improved user experience, enhanced system performance, and measurable business impact.`;
    } else if (type === 'skills') {
        const skills = text.split(',').map(s => s.trim()).filter(s => s);
        const half = Math.ceil(skills.length / 2);
        mockEnhanced = `Languages & Frameworks: ${skills.slice(0, half).join(', ')}\nTools & Technologies: ${skills.slice(half).join(', ')}`;
    } else {
        mockEnhanced = text.trim();
    }

    console.log("⚠️ Using fallback enhancement for type:", type);

    return res.json({
        enhancedText: mockEnhanced,
        warning: "AI service temporarily unavailable. Using smart enhancement."
    });
}

