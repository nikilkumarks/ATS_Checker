const pdf = require('pdf-parse');
const fs = require('fs');
const Activity = require('../models/Activity.cjs');
const { CohereClient } = require("cohere-ai");

exports.scanResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const jobDescription = req.body.jobDescription;
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required" });
        }

        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);

        // 1. Text Extraction
        let text = "";
        try {
            console.log(`📂 Processing file: ${req.file.originalname} (${req.file.mimetype})`);
            if (req.file.mimetype === 'application/pdf') {
                const data = await pdf(dataBuffer);
                text = data.text || "";
                console.log(`📄 PDF Metadata: Pages: ${data.numpages}, Info:`, data.info);
            } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                text = "DOCX extraction requires additional library. Please use PDF for now.";
            } else {
                text = dataBuffer.toString('utf8');
            }
        } catch (error) {
            console.error("❌ Extraction error:", error);
            text = "";
        }

        if (!text || text.trim().length < 50) {
            console.warn(`⚠️ Extraction too short: ${text?.length || 0} characters`);
            return res.status(422).json({
                message: "Could not extract enough text from the resume. Please ensure it is a text-based PDF and not a scanned image."
            });
        }
        console.log(`✅ Text extracted: ${text.length} characters`);

        // 2. AI Analysis
        let analysisResult = {
            score: 0,
            foundKeywords: [],
            missingKeywords: [],
            summary: "Analysis pending",
            analysis: ""
        };

        if (process.env.COHERE_API_KEY) {
            try {
                const cohere = new CohereClient({
                    token: process.env.COHERE_API_KEY,
                });

                const systemInstruction = "You are an ATS (Applicant Tracking System) expert. Analyze the provided resume text against the job description and return a JSON object.";

                const prompt = `
                Job Description:
                "${jobDescription}"

                Resume Content:
                "${text}"

                Your task:
                1. Calculate a match score (0-100).
                2. Identify key technical keywords found in the resume that match the JD.
                3. Identify critical keywords/skills missing from the resume but required in the JD.
                4. Provide a 1-sentence summary (e.g., "Strong match for frontend roles").
                5. Provide 3 specific bullet points for improvement.

                Return ONLY a JSON object in this format:
                {
                    "score": 85,
                    "foundKeywords": ["React", "Node.js"],
                    "missingKeywords": ["AWS", "Docker"],
                    "summary": "...",
                    "analysis": "Bullet points here..."
                }
                `;

                const response = await cohere.chat({
                    model: "command-r-08-2024",
                    message: prompt,
                    preamble: systemInstruction,
                    responseFormat: { type: "json_object" }
                });

                analysisResult = JSON.parse(response.text);

                console.log("✅ Cohere AI Scan successful");
            } catch (aiErr) {
                console.error("Cohere AI Analysis failed, using fallback:", aiErr.message);
                // Fallback is handled by the default analysisResult
                analysisResult = getMockScore(text, jobDescription);
            }
        } else {
            console.warn("COHERE_API_KEY not found, using mockup score");
            analysisResult = getMockScore(text, jobDescription);
        }

        // 3. Log Activity
        await Activity.create({
            user: req.user.id,
            type: 'RESUME_SCAN',
            title: `Resume Scan: ${req.file.originalname}`,
            details: { score: analysisResult.score }
        });

        // 4. Cleanup extracted file
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.warn("Could not delete temp file:", e.message);
        }

        res.json({
            ...analysisResult,
            fileName: req.file.originalname
        });

    } catch (err) {
        console.error("Scan Error:", err);
        res.status(500).json({ message: "Error processing resume" });
    }
};

function getMockScore(text, jd) {
    const keywords = ['javascript', 'react', 'node', 'express', 'mongodb', 'sql', 'python', 'java', 'aws', 'docker'];
    const foundKeywords = keywords.filter(kw => text.toLowerCase().includes(kw));
    const missing = keywords.filter(kw => jd.toLowerCase().includes(kw) && !text.toLowerCase().includes(kw));

    return {
        score: Math.min(100, Math.floor((foundKeywords.length / Math.max(1, (foundKeywords.length + missing.length))) * 100)) || 60,
        foundKeywords: foundKeywords,
        missingKeywords: missing,
        summary: "Mock analysis based on common keywords",
        analysis: "Consider adding more technical keywords found in the job description. Quantify your achievements."
    };
}
