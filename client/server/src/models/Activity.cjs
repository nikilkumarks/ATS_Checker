const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['RESUME_SCAN', 'RESUME_CREATE'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    details: {
        score: Number, // For scans
        foundKeywords: [String],
        missingKeywords: [String],
        summary: String,
        analysis: String,
        interviewQuestions: [
            {
                category: String,
                difficulty: String,
                question: String
            }
        ],
        attentionMap: [
            {
                section: String,
                attention: String,
                score: Number,
                reason: String
            }
        ],
        roleRecommendations: [
            {
                role: String,
                match: Number,
                missingSkills: [String],
                salaryRange: String,
                roadmap: [String]
            }
        ],
        jobDescription: String,
        template: String // For builder
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', activitySchema);
