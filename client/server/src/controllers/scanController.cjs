const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const Activity = require('../models/Activity.cjs');
const { CohereClient } = require("cohere-ai");

const ROLE_PROFILES = [
    {
        role: 'Frontend Developer',
        keywords: ['react', 'javascript', 'typescript', 'html', 'css', 'ui', 'frontend'],
        salaryRange: '$65k - $120k',
        roadmap: ['Deepen component architecture', 'Strengthen accessibility and performance', 'Build reusable design systems']
    },
    {
        role: 'Backend Developer',
        keywords: ['node', 'express', 'api', 'backend', 'mongodb', 'sql', 'rest'],
        salaryRange: '$75k - $130k',
        roadmap: ['Master API design and error handling', 'Improve database modeling', 'Add observability and testing']
    },
    {
        role: 'Full Stack Developer',
        keywords: ['react', 'node', 'express', 'mongodb', 'api', 'frontend', 'backend'],
        salaryRange: '$80k - $140k',
        roadmap: ['Balance UI and server-side skills', 'Build end-to-end products', 'Add deployment and scaling experience']
    },
    {
        role: 'DevOps Engineer',
        keywords: ['docker', 'cicd', 'aws', 'linux', 'deployment', 'kubernetes', 'terraform'],
        salaryRange: '$85k - $150k',
        roadmap: ['Practice CI/CD pipelines', 'Automate infrastructure tasks', 'Learn monitoring and release workflows']
    },
    {
        role: 'AI Engineer',
        keywords: ['python', 'ai', 'ml', 'llm', 'prompt', 'model', 'data'],
        salaryRange: '$90k - $160k',
        roadmap: ['Build model-driven projects', 'Study prompt and evaluation workflows', 'Learn data preparation and deployment']
    },
    {
        role: 'Data Analyst',
        keywords: ['sql', 'excel', 'python', 'tableau', 'dashboard', 'analytics', 'statistics'],
        salaryRange: '$60k - $105k',
        roadmap: ['Strengthen SQL and dashboarding', 'Practice business storytelling', 'Add experimentation and reporting']
    },
    {
        role: 'QA Engineer',
        keywords: ['testing', 'automation', 'selenium', 'cypress', 'jest', 'quality', 'bug'],
        salaryRange: '$60k - $110k',
        roadmap: ['Learn test strategy and coverage', 'Automate browser and API tests', 'Build regression workflows']
    }
];

const ATTENTION_SECTIONS = [
    { section: 'Skills', weight: 96, attention: 'high', reason: 'Recruiters scan for matching tools, languages, and keywords first.' },
    { section: 'Experience', weight: 92, attention: 'high', reason: 'Recent impact, scope, and outcomes are usually read early.' },
    { section: 'Projects', weight: 88, attention: 'high', reason: 'Projects show practical application and ownership.' },
    { section: 'Internships', weight: 78, attention: 'medium', reason: 'Relevant internships add signal for early-career candidates.' },
    { section: 'Education', weight: 70, attention: 'medium', reason: 'Education matters, but usually after skills and experience.' },
    { section: 'Certifications', weight: 66, attention: 'medium', reason: 'Certifications help when they support target-role skills.' },
    { section: 'Summary', weight: 44, attention: 'low', reason: 'Long summaries are often skimmed unless they are concise and targeted.' },
    { section: 'Hobbies', weight: 20, attention: 'low', reason: 'Irrelevant hobbies are frequently skipped by recruiters.' }
];

const QUESTION_TEMPLATES = {
    technical: [
        'Explain how you used {skill} in a real project.',
        'What trade-offs did you face while working with {skill}?',
        'How would you debug a production issue in a {skill}-based application?'
    ],
    project: [
        'Walk me through your most impactful project and your exact contribution.',
        'What was the hardest engineering challenge in one of your projects?',
        'How did you measure success for the project you are most proud of?'
    ],
    hr: [
        'Tell me about a time you had to learn a new tool quickly.',
        'How do you prioritize when multiple deadlines overlap?',
        'What kind of team environment helps you do your best work?'
    ],
    company: [
        'Why do you want to work for a startup environment?',
        'How do you handle ambiguity in a product-focused company?',
        'How would you contribute in a service-oriented delivery team?'
    ]
};

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
        const text = await extractResumeText(filePath, req.file.mimetype, req.file.originalname);

        if (!text || text.trim().length < 50) {
            console.warn(`⚠️ Extraction too short: ${text?.length || 0} characters`);
            return res.status(422).json({
                message: "Could not extract enough text from the resume. Please upload a text-based PDF or DOCX file."
            });
        }
        console.log(`✅ Text extracted: ${text.length} characters`);

        // 2. AI Analysis
        if (!process.env.COHERE_API_KEY) {
            return res.status(500).json({ message: "COHERE_API_KEY is not configured" });
        }

        let analysisResult;

        try {
            const cohere = new CohereClient({
                token: process.env.COHERE_API_KEY,
            });

            const systemInstruction = "You are an ATS (Applicant Tracking System) expert. Analyze the provided resume text against the job description and return a single JSON object. Base every suggestion strictly on the resume content and the job description. Do not invent skills or roles that are not supported by the text.";

            const prompt = `
Job Description:
"${jobDescription}"

Resume Content:
"${text}"

Return ONLY valid JSON in this exact shape:
{
  "score": 85,
  "foundKeywords": ["React", "Node.js"],
  "missingKeywords": ["AWS", "Docker"],
  "summary": "One sentence summary grounded in the resume and job description.",
  "analysis": "Three concise improvement bullets separated by new lines.",
  "interviewQuestions": [
    { "category": "Technical", "difficulty": "Intermediate", "question": "..." }
  ],
  "attentionMap": [
    { "section": "Skills", "attention": "high", "score": 95, "reason": "..." }
  ],
  "roleRecommendations": [
    {
      "role": "Full Stack Developer",
      "match": 92,
      "matchedSkills": ["React"],
      "missingSkills": ["Docker"],
      "salaryRange": "$80k - $140k",
      "roadmap": ["..."]
    }
  ]
}
`;

            const response = await cohere.chat({
                model: "command-r-08-2024",
                message: prompt,
                preamble: systemInstruction,
                responseFormat: { type: "json_object" }
            });

            analysisResult = normalizeAnalysisResult(parseCohereJson(response.text), text, jobDescription);
            console.log("✅ Cohere AI Scan successful");
        } catch (aiErr) {
            console.error("Cohere AI Analysis failed:", aiErr.message);
            return res.status(502).json({
                message: "AI analysis failed. Please try again.",
                details: aiErr.message
            });
        }

        // 3. Log Activity
        await Activity.create({
            user: req.user.id,
            type: 'RESUME_SCAN',
            title: `Resume Scan: ${req.file.originalname}`,
            details: {
                score: analysisResult.score,
                foundKeywords: analysisResult.foundKeywords,
                missingKeywords: analysisResult.missingKeywords,
                summary: analysisResult.summary,
                analysis: analysisResult.analysis,
                interviewQuestions: analysisResult.interviewQuestions,
                attentionMap: analysisResult.attentionMap,
                roleRecommendations: analysisResult.roleRecommendations,
                jobDescription: jobDescription
            }
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
}

async function extractResumeText(filePath, mimetype, originalname) {
    const dataBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(originalname || '').toLowerCase();

    console.log(`📂 Processing file: ${originalname} (${mimetype})`);

    if (mimetype === 'application/pdf' || fileExtension === '.pdf') {
        const data = await pdf(dataBuffer);
        console.log(`📄 PDF Metadata: Pages: ${data.numpages}, Info:`, data.info);
        return data.text || '';
    }

    if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileExtension === '.docx') {
        const docxResult = await mammoth.extractRawText({ path: filePath });
        return docxResult.value || '';
    }

    if (mimetype === 'application/msword' || fileExtension === '.doc') {
        throw new Error('DOC files are not supported. Please upload a PDF or DOCX file.');
    }

    return dataBuffer.toString('utf8');
}

function parseCohereJson(text) {
    if (!text) {
        throw new Error('Empty AI response');
    }

    const trimmed = String(text).trim();
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
        throw new Error('AI response did not contain valid JSON');
    }

    return JSON.parse(trimmed.slice(start, end + 1));
}

function normalizeAnalysisResult(result, text, jd) {
    const foundKeywords = Array.isArray(result.foundKeywords) ? result.foundKeywords : [];
    const missingKeywords = Array.isArray(result.missingKeywords) ? result.missingKeywords : [];
    const roleRecommendations = Array.isArray(result.roleRecommendations)
        ? result.roleRecommendations.slice(0, 5).map((role) => ({
            role: role.role || '',
            match: clampScore(role.match),
            matchedSkills: Array.isArray(role.matchedSkills) ? role.matchedSkills.slice(0, 5) : [],
            missingSkills: Array.isArray(role.missingSkills) ? role.missingSkills.slice(0, 5) : [],
            salaryRange: role.salaryRange || '',
            roadmap: Array.isArray(role.roadmap) ? role.roadmap.slice(0, 5) : [],
            signals: Array.isArray(role.signals) ? role.signals.slice(0, 5) : []
        }))
        : [];

    return {
        score: clampScore(result.score),
        foundKeywords,
        missingKeywords,
        summary: result.summary || '',
        analysis: result.analysis || '',
        interviewQuestions: Array.isArray(result.interviewQuestions) && result.interviewQuestions.length > 0
            ? result.interviewQuestions.slice(0, 10)
            : [],
        attentionMap: Array.isArray(result.attentionMap) && result.attentionMap.length > 0
            ? result.attentionMap.slice(0, 8)
            : [],
        roleRecommendations
    };
}

function clampScore(value) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
        return 0;
    }

    return Math.max(0, Math.min(100, Math.round(numeric)));
}
