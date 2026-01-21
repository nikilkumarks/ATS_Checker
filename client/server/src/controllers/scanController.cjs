const pdf = require('pdf-parse');
const fs = require('fs');
const Activity = require('../models/Activity.cjs');

exports.scanResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);

        // 1. Text Extraction
        let text = "";
        if (req.file.mimetype === 'application/pdf') {
            const data = await pdf(dataBuffer);
            text = data.text;
        } else {
            // Placeholder for DOCX (would need 'mammoth' or similar)
            // For now, we'll just say we can't fully parse DOCX text deeply in this simplified version without extra libs
            text = "DOCX Content parsing pending implementation. Simulated content.";
        }

        // 2. Simple Analysis Logic (Mock ATS Algorithm)
        // In a real app, you would compare 'text' against a job description provided in req.body

        // For this demo, we check for common keywords
        const keywords = ['javascript', 'react', 'node', 'express', 'mongodb', 'sql', 'python', 'java', 'communication', 'teamwork'];
        const foundKeywords = keywords.filter(kw => text.toLowerCase().includes(kw));
        const score = Math.min(100, Math.floor((foundKeywords.length / 5) * 100)) || 65; // Mock score logic ensuring non-zero

        // 3. Log Activity
        await Activity.create({
            user: req.user.id,
            type: 'RESUME_SCAN',
            title: `Resume Scan: ${req.file.originalname}`,
            details: { score: score }
        });

        // 4. Cleanup (optional: delete file after processing to save space)
        // fs.unlinkSync(filePath); 

        res.json({
            message: "Scan Complete",
            score: score,
            foundKeywords: foundKeywords,
            fileName: req.file.originalname
        });

    } catch (err) {
        console.error("Scan Error:", err);
        res.status(500).json({ message: "Error processing resume" });
    }
};
