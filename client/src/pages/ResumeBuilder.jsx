import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Wand2, ChevronRight, ChevronLeft, Download, Plus, Trash2, Layout,
    User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Globe, Languages,
    Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Sparkles
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeBuilder() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('classic'); // Default to most ATS friendly
    const previewRef = useRef(null);

    // AI suggestion state
    const [aiSuggestion, setAiSuggestion] = useState(null); // { original, enhanced, field, id, type }


    const [resumeData, setResumeData] = useState({
        personal: {
            fullName: "", jobTitle: "", email: "", phone: "", location: "", linkedin: "", github: ""
        },
        summary: "",
        skills: "",
        experience: [
            { id: 1, title: "Software Engineer", company: "Tech Solutions", location: "New York, NY", startDate: "Jan 2022", endDate: "Present", description: "• Developed scalable web applications using React and Node.js.\n• Optimized database queries improving performance by 30%." }
        ],
        projects: [
            { id: 1, name: "ATS Resume Builder", techStack: "React, Node.js, MongoDB", description: "Built an AI-powered resume builder that improved resume screening efficiency." }
        ],
        education: [
            { id: 1, degree: "B.Tech Computer Science", school: "State University", year: "2022", grade: "3.8 GPA" }
        ],
        certifications: [],
        achievements: [],
        languages: []
    });

    const steps = [
        { title: "Header", icon: <User size={18} />, key: "personal" },
        { title: "Summary", icon: <Briefcase size={18} />, key: "summary" },
        { title: "Experience", icon: <Briefcase size={18} />, key: "experience" },
        { title: "Projects", icon: <FolderGit2 size={18} />, key: "projects" },
        { title: "Education", icon: <GraduationCap size={18} />, key: "education" },
        { title: "Skills", icon: <Code2 size={18} />, key: "skills" },
        { title: "Extras", icon: <Award size={18} />, key: "extras" },
        { title: "Finish", icon: <Layout size={18} />, key: "template" }
    ];

    // --- Handlers ---

    const handlePersonalChange = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }));
    };

    const handleSimpleChange = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    // Generic CRUD Helper
    const addItem = (section, template) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], { id: Date.now(), ...template }]
        }));
    };
    const updateItem = (section, id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };
    const removeItem = (section, id) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    // Specific Adders
    const addExperience = () => addItem('experience', { title: "", company: "", location: "", startDate: "", endDate: "", description: "" });
    const addProject = () => addItem('projects', { name: "", techStack: "", link: "", description: "" });
    const addEducation = () => addItem('education', { degree: "", school: "", year: "", grade: "" });
    const addCertification = () => addItem('certifications', { name: "", platform: "", year: "" });
    const addAchievement = () => addItem('achievements', { title: "" });
    const addLanguage = () => addItem('languages', { name: "", level: "" });

    const handleAIEnhance = async (field, text, type, id = null) => {
        if (!text || text.trim().length < 5) {
            alert("Please enter more text to enhance (at least 5 characters).");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5000/api/ai/enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ text, type })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server error: ${res.status}`);
            }

            const data = await res.json();

            if (data.enhancedText) {
                setAiSuggestion({
                    field,
                    id,
                    type,
                    original: text,
                    enhanced: data.enhancedText,
                    warning: data.warning || null
                });
            } else {
                alert("AI could not enhance this text. Please try again.");
            }

        } catch (err) {
            console.error("AI Enhancement Error:", err);
            alert(`Error: ${err.message}\n\nMake sure the server is running on port 5000.`);
        } finally {
            setLoading(false);
        }
    };


    const applyAISuggestion = () => {
        if (!aiSuggestion) return;
        const { field, id, enhanced } = aiSuggestion;

        if (field === 'experience' && id) updateItem('experience', id, 'description', enhanced);
        else if (field === 'projects' && id) updateItem('projects', id, 'description', enhanced);
        else if (field === 'summary') handleSimpleChange('summary', enhanced);
        else if (field === 'skills') handleSimpleChange('skills', enhanced);
        else if (field === 'jobTitle') handlePersonalChange('jobTitle', enhanced);

        setAiSuggestion(null);
    };


    const handleDownloadPDF = async () => {
        const previewElement = document.getElementById('resume-preview');
        if (!previewElement) return;

        setLoading(true);
        try {
            window.scrollTo({ top: 0, behavior: 'instant' });

            const canvas = await html2canvas(previewElement, {
                scale: 2, // High quality but more stable than 3
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                windowWidth: 1200, // Wider window to prevent responsive wrapping
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('resume-preview');
                    if (!el) return;

                    // Force the element to be visible and correctly sized in the clone
                    el.style.transform = 'none';
                    el.style.scale = '1';
                    el.style.margin = '0';
                    el.style.padding = '0';
                    el.style.display = 'block';

                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                        
                        * { 
                            box-sizing: border-box !important; 
                            -webkit-print-color-adjust: exact !important; 
                            print-color-adjust: exact !important;
                            transition: none !important;
                            animation: none !important;
                        }

                        #resume-preview { 
                            width: 794px !important; 
                            height: auto !important;
                            min-height: 1123px !important;
                            background: white !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            position: relative !important;
                            box-shadow: none !important;
                        }

                        /* Force template fonts */
                        .font-sans { font-family: 'Inter', system-ui, -apple-system, sans-serif !important; }
                        .font-serif { font-family: Garamond, 'Times New Roman', serif !important; }
                        .font-mono { font-family: 'JetBrains Mono', 'Courier New', monospace !important; }

                        /* Double column layout fixes */
                        .flex-row { display: flex !important; flex-direction: row !important; }
                        .flex-nowrap { flex-wrap: nowrap !important; }
                        
                        aside { width: 260px !important; flex-shrink: 0 !important; }
                        main { width: 534px !important; flex-shrink: 0 !important; }

                        /* Ensure background colors are rendered */
                        .bg-\\[\\#0f172a\\] { background-color: #0f172a !important; }
                        .bg-\\[\\#ffffff\\] { background-color: #ffffff !important; }
                    `;
                    clonedDoc.head.appendChild(style);

                    // Note: Removed the problematic oklch deletion loop that was breaking Tailwind 4 styles
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            const ratio = pdfWidth / canvasWidth;
            const finalImageHeight = canvasHeight * ratio;

            let heightLeft = finalImageHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, finalImageHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - finalImageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, finalImageHeight, undefined, 'FAST');
                heightLeft -= pdfHeight;
            }

            const fileName = (resumeData.personal.fullName || 'Resume').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            pdf.save(`${fileName}_Professional.pdf`);
        } catch (err) {
            console.error("PDF Export Error:", err);
            alert("Export failed. Please try a different template or check your connection.");
        } finally {
            setLoading(false);
        }
    };



    // --- Render Editors ---

    const renderEditor = () => {
        switch (activeStep) {
            case 0: // Header
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <User size={20} />
                            </div>
                            <h3 className="section-title mb-0">Header Information</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                <input type="text" placeholder="e.g. John Doe" className="input-field font-semibold" value={resumeData.personal.fullName || ""} onChange={(e) => handlePersonalChange('fullName', e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Target Job Title</label>
                                <div className="relative group">
                                    <input type="text" placeholder="e.g. Senior Frontend Engineer" className="input-field pr-28" value={resumeData.personal.jobTitle || ""} onChange={(e) => handlePersonalChange('jobTitle', e.target.value)} />
                                    <button
                                        onClick={() => handleAIEnhance('jobTitle', resumeData.personal.jobTitle, 'general')}
                                        disabled={loading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 ai-btn-sm"
                                    >
                                        <Sparkles size={12} /> Optimize
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="input-field" value={resumeData.personal.email || ""} onChange={(e) => handlePersonalChange('email', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                                    <input type="text" placeholder="+1 (555) 000-0000" className="input-field" value={resumeData.personal.phone || ""} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Location</label>
                                <input type="text" placeholder="City, Country" className="input-field" value={resumeData.personal.location || ""} onChange={(e) => handlePersonalChange('location', e.target.value)} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">LinkedIn Profile</label>
                                    <div className="relative">
                                        <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="text" placeholder="linkedin.com/in/username" className="input-field pl-9" value={resumeData.personal.linkedin || ""} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Portfolio / GitHub</label>
                                    <div className="relative">
                                        <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="text" placeholder="github.com/username" className="input-field pl-9" value={resumeData.personal.github || ""} onChange={(e) => handlePersonalChange('github', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 1: // Summary
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Professional Summary</h3>
                                    <p className="text-xs text-gray-400">Highlight your expertise & impact</p>
                                </div>
                            </div>
                            <button onClick={() => handleAIEnhance('summary', resumeData.summary, 'summary')} disabled={loading} className="ai-btn scale-90">
                                <Sparkles size={14} /> {loading ? "..." : "AI Enhance"}
                            </button>
                        </div>
                        <div className="relative group">
                            <textarea className="textarea-field h-52 custom-scrollbar" placeholder="e.g. Results-driven Software Engineer with 5+ years of experience in building scalable web applications..." value={resumeData.summary} onChange={(e) => handleSimpleChange('summary', e.target.value)} />
                            <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 font-mono">
                                {resumeData.summary.length} characters
                            </div>
                        </div>
                    </div>
                );
            case 2: // Experience
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div className="flex items-center justify-between gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                                    <Briefcase size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-tight">Work Experience</h3>
                                    <p className="text-[11px] text-gray-500 font-medium">Add your professional history</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {resumeData.experience.map((exp, index) => (
                                <div key={exp.id} className="card-input group">
                                    <div className="flex justify-between items-center mb-5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-white/5">
                                                {index + 1}
                                            </span>
                                            <h4 className="font-bold text-sm text-gray-300">Experience</h4>
                                        </div>
                                        <button onClick={() => removeItem('experience', exp.id)} className="delete-btn opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Job Title</label>
                                            <input type="text" placeholder="e.g. Senior Developer" className="input-field" value={exp.title || ""} onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Company</label>
                                            <input type="text" placeholder="e.g. Google" className="input-field" value={exp.company || ""} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Start Date</label>
                                            <input type="text" placeholder="MM/YYYY" className="input-field" value={exp.startDate || ""} onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">End Date</label>
                                            <input type="text" placeholder="Present" className="input-field" value={exp.endDate || ""} onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)} />
                                        </div>
                                        <div className="sm:col-span-2 space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Location</label>
                                            <input type="text" placeholder="City, State" className="input-field" value={exp.location || ""} onChange={(e) => updateItem('experience', exp.id, 'location', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Description & Achievements</label>
                                        <div className="relative">
                                            <textarea placeholder="• Developed scalable systems..." className="textarea-field h-36 custom-scrollbar" value={exp.description || ""} onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)} />
                                            <button onClick={() => handleAIEnhance('experience', exp.description, 'experience', exp.id)} disabled={loading} className="ai-btn-sm absolute bottom-3 right-3 shadow-lg">
                                                <Sparkles size={12} /> AI Rewrite
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={addExperience} className="add-btn py-3.5 hover:shadow-lg hover:shadow-purple-500/5 group border-white/5 bg-white/[0.02]">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Add New Experience</span>
                        </button>
                    </div>
                );
            case 3: // Projects
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div className="flex items-center gap-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                            <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
                                <Code2 size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white leading-tight">Personal Projects</h3>
                                <p className="text-[11px] text-gray-500 font-medium">Showcase your best work</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {resumeData.projects.map((proj, index) => (
                                <div key={proj.id} className="card-input group">
                                    <div className="flex justify-between items-center mb-5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-white/5">
                                                {index + 1}
                                            </span>
                                            <h4 className="font-bold text-sm text-gray-300">Project</h4>
                                        </div>
                                        <button onClick={() => removeItem('projects', proj.id)} className="delete-btn opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 mb-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Project Name</label>
                                            <input type="text" placeholder="e.g. AI Portfolio" className="input-field" value={proj.name || ""} onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Tech Stack</label>
                                            <input type="text" placeholder="e.g. React, Tailwind, OpenAI" className="input-field" value={proj.techStack || ""} onChange={(e) => updateItem('projects', proj.id, 'techStack', e.target.value)} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Live Link / GitHub</label>
                                            <div className="relative">
                                                <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input type="text" placeholder="https://github.com/..." className="input-field pl-9" value={proj.link || ""} onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Project Description</label>
                                        <div className="relative">
                                            <textarea placeholder="Describe what you built and how..." className="textarea-field h-32 custom-scrollbar" value={proj.description || ""} onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)} />
                                            <button onClick={() => handleAIEnhance('projects', proj.description, 'projects', proj.id)} disabled={loading} className="ai-btn-sm absolute bottom-3 right-3 shadow-lg">
                                                <Sparkles size={12} /> AI Rewrite
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={addProject} className="add-btn py-3.5 hover:shadow-lg hover:shadow-purple-500/5 group border-white/5 bg-white/[0.02]">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Add New Project</span>
                        </button>
                    </div>
                );
            case 4: // Education
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div className="flex items-center gap-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                            <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
                                <GraduationCap size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white leading-tight">Education</h3>
                                <p className="text-[11px] text-gray-500 font-medium">Your academic background</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {resumeData.education.map((edu, index) => (
                                <div key={edu.id} className="card-input group">
                                    <div className="flex justify-between items-center mb-5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-white/5">
                                                {index + 1}
                                            </span>
                                            <h4 className="font-bold text-sm text-gray-300">Education</h4>
                                        </div>
                                        <button onClick={() => removeItem('education', edu.id)} className="delete-btn opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Degree / Field of Study</label>
                                            <input type="text" placeholder="e.g. B.S. in Computer Science" className="input-field" value={edu.degree || ""} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">School / University</label>
                                            <input type="text" placeholder="e.g. Stanford University" className="input-field" value={edu.school || ""} onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Graduation Year</label>
                                                <input type="text" placeholder="e.g. 2023" className="input-field" value={edu.year || ""} onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">GPA / Grade</label>
                                                <input type="text" placeholder="e.g. 3.9/4.0" className="input-field" value={edu.grade || ""} onChange={(e) => updateItem('education', edu.id, 'grade', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={addEducation} className="add-btn py-3.5 hover:shadow-lg hover:shadow-purple-500/5 group border-white/5 bg-white/[0.02]">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Add Education</span>
                        </button>
                    </div>
                );
            case 5: // Skills
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-orange-500/20 rounded-xl text-orange-400">
                                    <Code2 size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-tight">Technical Skills</h3>
                                    <p className="text-[11px] text-gray-500 font-medium">List your core competencies</p>
                                </div>
                            </div>
                            <button onClick={() => handleAIEnhance('skills', resumeData.skills, 'skills')} disabled={loading} className="ai-btn scale-90">
                                <Sparkles size={14} /> {loading ? "..." : "Optimize"}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <textarea className="textarea-field h-52 custom-scrollbar font-mono text-sm" placeholder="e.g. Languages: JavaScript, Python, C++
Frameworks: React, Node.js, Express
Tools: Git, Docker, Kubernetes..." value={resumeData.skills} onChange={(e) => handleSimpleChange('skills', e.target.value)} />
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
                                <Wand2 size={16} className="text-purple-400 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-purple-300/80 leading-relaxed font-medium">
                                    <span className="text-purple-400 font-bold uppercase tracking-wider text-[9px] block mb-1">ATS Tip</span>
                                    Group your skills by categories (e.g. Languages, Tools) to help parsing algorithms identify your expertise faster.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 6: // Extras
                return (
                    <div className="space-y-8 animate-slide-up">
                        {/* Certifications */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Award size={18} className="text-yellow-500" />
                                <h3 className="font-bold text-gray-200">Certifications</h3>
                            </div>
                            <div className="space-y-3">
                                {resumeData.certifications.map((cert) => (
                                    <div key={cert.id} className="flex gap-3 group items-end bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                        <div className="flex-1 space-y-1.5">
                                            <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Certificate Name</label>
                                            <input type="text" placeholder="e.g. AWS Solutions Architect" className="input-field py-2 text-sm" value={cert.name || ""} onChange={(e) => updateItem('certifications', cert.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="w-1/3 space-y-1.5">
                                            <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Year/Platform</label>
                                            <input type="text" placeholder="2023" className="input-field py-2 text-sm" value={cert.year || ""} onChange={(e) => updateItem('certifications', cert.id, 'year', e.target.value)} />
                                        </div>
                                        <button onClick={() => removeItem('certifications', cert.id)} className="p-2.5 text-gray-600 hover:text-red-400 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addCertification} className="flex items-center gap-2 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors ml-1 uppercase tracking-wider">
                                <Plus size={14} fill="currentColor" /> Add Certificate
                            </button>
                        </div>

                        {/* Achievements */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Sparkles size={18} className="text-purple-400" />
                                <h3 className="font-bold text-gray-200">Key Achievements</h3>
                            </div>
                            <div className="space-y-3">
                                {resumeData.achievements.map((ach) => (
                                    <div key={ach.id} className="flex gap-3 group items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                        <div className="flex-1">
                                            <input type="text" placeholder="e.g. Reduced latency by 40%..." className="input-field py-2 text-sm" value={ach.title || ""} onChange={(e) => updateItem('achievements', ach.id, 'title', e.target.value)} />
                                        </div>
                                        <button onClick={() => removeItem('achievements', ach.id)} className="p-2.5 text-gray-600 hover:text-red-400 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addAchievement} className="flex items-center gap-2 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors ml-1 uppercase tracking-wider">
                                <Plus size={14} fill="currentColor" /> Add Achievement
                            </button>
                        </div>
                    </div>
                );
            case 7: // Finish / Templates
                return (
                    <div className="space-y-8 animate-slide-up">
                        <div className="flex items-center gap-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                            <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
                                <Layout size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white leading-tight">Pick a Template</h3>
                                <p className="text-[11px] text-gray-500 font-medium">Select the best look for your resume</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'classic', name: 'Standard ATS', desc: 'Maximum Parsing Rate', color: 'slate' },
                                { id: 'modern', name: 'Modern Clean', desc: 'Perfect for High-Tech', color: 'indigo' },
                                { id: 'minimal', name: 'Minimalist', desc: 'Focus on Experience', color: 'emerald' }
                            ].map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${selectedTemplate === t.id ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                                >
                                    {selectedTemplate === t.id && (
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-4 border-[#09090b]">
                                            <Sparkles size={14} className="text-white" />
                                        </div>
                                    )}
                                    <div className={`h-28 rounded-xl mb-4 flex items-center justify-center transition-all group-hover:scale-105 ${selectedTemplate === t.id ? 'bg-purple-500/20' : 'bg-white/5'}`}>
                                        <Layout size={32} className={selectedTemplate === t.id ? "text-purple-400" : "text-gray-600"} />
                                    </div>
                                    <p className="font-bold text-sm text-center mb-1">{t.name}</p>
                                    <p className="text-[10px] text-center text-gray-500 font-medium uppercase tracking-wider">{t.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={loading}
                                className={`w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-lg shadow-[0_10px_30px_rgba(139,92,246,0.25)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.35)] hover:-translate-y-1 transition-all active:scale-95 flex justify-center items-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        <span>Crafting PDF...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={22} strokeWidth={3} />
                                        <span>Download Resume</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-500 mt-4 font-medium uppercase tracking-[0.2em]">Validated for ATS performance</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-inter">
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                }
                .section-title { 
                    font-size: 1.1rem; 
                    font-weight: 700; 
                    color: #e2e8f0; 
                    margin-bottom: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .input-field { 
                    width: 100%; 
                    background: rgba(255, 255, 255, 0.03); 
                    border: 1px solid rgba(255, 255, 255, 0.1); 
                    border-radius: 0.75rem; 
                    padding: 0.875rem 1rem; 
                    color: #f8fafc; 
                    outline: none; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 0.95rem;
                }
                .input-field:focus { 
                    border-color: #8b5cf6; 
                    background: rgba(255, 255, 255, 0.06);
                    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
                }
                .textarea-field { 
                    width: 100%; 
                    background: rgba(255, 255, 255, 0.03); 
                    border: 1px solid rgba(255, 255, 255, 0.1); 
                    border-radius: 0.75rem; 
                    padding: 1rem; 
                    color: #f8fafc; 
                    outline: none; 
                    resize: none; 
                    transition: all 0.3s ease; 
                    font-size: 0.95rem; 
                    line-height: 1.6; 
                }
                .textarea-field:focus { 
                    border-color: #8b5cf6;
                    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
                }
                .card-input { 
                    padding: 1.5rem; 
                    background: rgba(255, 255, 255, 0.02); 
                    border: 1px solid rgba(255, 255, 255, 0.06); 
                    border-radius: 1rem; 
                    margin-bottom: 1.5rem; 
                    position: relative;
                    transition: transform 0.2s ease;
                }
                .card-input:hover {
                    border-color: rgba(255, 255, 255, 0.12);
                }
                .ai-btn { 
                    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%); 
                    border-radius: 0.75rem; 
                    padding: 0.625rem 1.25rem; 
                    font-size: 0.85rem; 
                    display: flex; 
                    align-items: center; 
                    gap: 0.5rem; 
                    font-weight: 600;
                    color: white;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                    transition: all 0.3s ease;
                }
                .ai-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
                }
                .ai-btn-sm { 
                    background: rgba(139, 92, 246, 0.1); 
                    border: 1px solid rgba(139, 92, 246, 0.2); 
                    border-radius: 0.5rem; 
                    padding: 0.4rem 0.75rem; 
                    font-size: 0.75rem; 
                    display: flex; 
                    align-items: center; 
                    gap: 0.375rem; 
                    color: #c4b5fd;
                    transition: all 0.2s ease;
                }
                .ai-btn-sm:hover {
                    background: rgba(139, 92, 246, 0.2);
                    border-color: rgba(139, 92, 246, 0.4);
                }
                .add-btn { 
                    width: 100%; 
                    padding: 1rem; 
                    border: 2px dashed rgba(255, 255, 255, 0.1); 
                    border-radius: 0.75rem; 
                    color: #94a3b8; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    gap: 0.5rem; 
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                .add-btn:hover { 
                    border-color: #8b5cf6; 
                    color: #c4b5fd; 
                    background: rgba(139, 92, 246, 0.04); 
                }
                .delete-btn { 
                    color: #94a3b8; 
                    padding: 0.5rem; 
                    border-radius: 0.5rem; 
                    transition: all 0.2s ease; 
                }
                .delete-btn:hover { 
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1); 
                }
                
                /* SCROLLBAR */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
            `}</style>

            {/* LEFT PANEL: WIZARD */}
            <div className="w-full md:w-[45%] lg:w-[40%] border-r border-white/10 flex flex-col h-screen bg-[#09090b] relative z-20">
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90 border border-transparent hover:border-white/10">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Resume Builder</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="h-1 w-1 rounded-full bg-purple-500"></div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}</p>
                            </div>
                        </div>
                    </div>
                    {activeStep === 7 && (
                        <button onClick={handleDownloadPDF} disabled={loading} className="md:hidden ai-btn py-2 px-4">
                            <Download size={16} />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gradient-to-b from-[#09090b] to-black">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {renderEditor()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="p-5 border-t border-white/10 flex justify-between bg-[#09090b]/80 backdrop-blur-md sticky bottom-0 z-30">
                    <button
                        onClick={() => setActiveStep(p => Math.max(0, p - 1))}
                        disabled={activeStep === 0}
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    >
                        Back
                    </button>

                    <div className="flex gap-1.5 items-center">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300 ${i === activeStep ? 'w-6 bg-purple-500' : 'w-1 bg-white/10'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setActiveStep(p => Math.min(steps.length - 1, p + 1))}
                        disabled={activeStep === steps.length - 1}
                        className="px-7 py-2.5 rounded-xl bg-white text-black font-bold text-sm shadow-lg shadow-white/5 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-20 flex items-center gap-2"
                    >
                        {activeStep === steps.length - 2 ? 'Preview' : 'Next'}
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL: LIVE PREVIEW */}
            <div className={`
                ${activeStep === 7 ? 'fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl p-6 flex flex-col items-center custom-scrollbar overflow-y-auto' : 'hidden'} 
                md:static md:flex md:flex-1 md:bg-[#0c0c0e] md:items-start md:justify-center md:pt-16 md:pb-32 md:px-12 md:overflow-y-auto custom-scrollbar relative
            `}>
                {/* Mobile Close Button (only visible on step 7 mobile) */}
                {activeStep === 7 && (
                    <button
                        onClick={() => setActiveStep(6)}
                        className="md:hidden absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white z-[70] backdrop-blur-md border border-white/10 active:scale-95 transition-all"
                    >
                        <Trash2 size={24} className="rotate-45" />
                    </button>
                )}

                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-4 bg-[#1a1a1c]/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Live Preview</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Layout size={14} className="text-purple-400" />
                        <span className="text-[10px] font-black tracking-widest text-white uppercase">{selectedTemplate}</span>
                    </div>
                </div>

                <div
                    ref={previewRef}
                    id="resume-preview"
                    key={selectedTemplate}
                    className={`
                        w-[794px] bg-white text-black shadow-[0_40px_100px_rgba(0,0,0,0.5)] origin-top 
                        scale-[0.35] sm:scale-[0.5] md:scale-[0.55] lg:scale-[0.72] xl:scale-[0.88] 
                        transition-all duration-500 ease-out
                        pb-16
                    `}
                    style={{
                        minHeight: '1123px',
                        fontFamily: selectedTemplate === 'modern' ? 'ui-sans-serif, system-ui, sans-serif' : selectedTemplate === 'classic' ? 'Garamond, Times New Roman, serif' : 'JetBrains Mono, monospace'
                    }}
                >
                    {/* --- TEMPLATE RENDERER --- */}

                    {(() => {
                        const styles = {
                            classic: {
                                layout: "single",
                                container: "font-serif text-[#111827] bg-[#ffffff] w-[794px] min-h-[1123px] overflow-hidden p-[20mm] shadow-none",
                                header: "text-center mb-10 border-b-2 border-[#111827] pb-8",
                                name: "text-4xl font-bold uppercase tracking-[0.15em] mb-3 text-[#111827]",
                                title: "text-lg italic text-[#4b5563] mb-4 font-medium",
                                meta: "flex justify-center flex-wrap text-[13px] text-[#374151] gap-x-6 gap-y-2 font-medium italic",
                                sectionTitle: "text-[15px] font-bold uppercase tracking-[0.2em] border-b border-[#9ca3af] mb-4 pb-1.5 mt-8 text-[#111827]",
                                body: "text-[13.5px] leading-[1.6] text-justify text-[#374151]",
                                subTitle: "font-bold text-[#111827] text-[14.5px]",
                                metaInfo: "italic text-[#4b5563] text-[13px] font-medium",
                                date: "text-[#4b5563] font-serif italic text-[13px]"
                            },
                            modern: {
                                layout: "double",
                                container: "font-sans text-[#0f172a] bg-[#ffffff] flex flex-row flex-nowrap w-[794px] min-h-[1123px] shadow-none",
                                sidebar: "w-[260px] flex-shrink-0 bg-[#0f172a] text-[#ffffff] p-8 flex flex-col gap-8",
                                main: "w-[534px] flex-shrink-0 p-10 bg-[#ffffff] flex flex-col gap-10",
                                header: "mb-2",
                                name: "text-[32px] font-black tracking-tighter leading-tight mb-2 text-[#ffffff]",
                                title: "text-sm text-[#818cf8] font-bold uppercase tracking-[0.15em] leading-relaxed",
                                meta: "flex-col gap-4 text-[12px] font-medium text-[#cbd5e1]",
                                sectionTitle: "text-lg font-black text-[#0f172a] mb-6 pb-2 border-b-4 border-[#4f46e5] inline-block",
                                sidebarTitle: "text-[11px] font-black uppercase tracking-[0.25em] text-[#a5b4fc] mb-5 border-b border-white/10 pb-2",
                                body: "text-[13px] leading-[1.7] text-[#475569] font-medium",
                                subTitle: "font-bold text-[#0f172a] text-[15px] flex justify-between items-start gap-4",
                                metaInfo: "text-[#4f46e5] font-bold text-[11px] uppercase tracking-[0.1em] mt-1",
                                date: "text-[#94a3b8] font-bold text-[10px] uppercase shrink-0 mt-1"
                            },
                            minimal: {
                                layout: "single",
                                container: "font-mono text-[#1f2937] bg-[#ffffff] p-16 w-[794px] min-h-[1123px] shadow-none",
                                header: "mb-12 text-left",
                                name: "text-[28px] font-bold tracking-tight text-[#000000] mb-3",
                                title: "text-xs uppercase tracking-[0.3em] text-[#6b7280] mb-8 font-bold",
                                meta: "flex-col text-[11px] text-[#4b5563] gap-2 items-start font-medium",
                                sectionTitle: "text-[11px] font-black uppercase tracking-[0.3em] text-[#9ca3af] mb-8 mt-12 flex items-center gap-4 before:h-px before:flex-1 before:bg-gray-100 after:h-px after:flex-1 after:bg-gray-100",
                                body: "text-[12px] leading-[1.8] text-[#4b5563]",
                                subTitle: "font-bold text-[#000000] text-[13px] uppercase tracking-wide",
                                metaInfo: "text-[#6b7280] text-[11px] font-medium",
                                date: "text-[#9ca3af] text-[11px] font-bold"
                            }
                        };
                        const t = styles[selectedTemplate] || styles.classic;

                        if (t.layout === "double") {
                            return (
                                <div className={t.container}>
                                    {/* SIDEBAR */}
                                    <aside className={t.sidebar}>
                                        <div className={t.header}>
                                            <h1 className={t.name}>{resumeData.personal.fullName || "YOUR NAME"}</h1>
                                            <p className={t.title}>{resumeData.personal.jobTitle || "TARGET TITLE"}</p>
                                        </div>

                                        <section className="mb-0">
                                            <h3 className={t.sidebarTitle}>Contact</h3>
                                            <div className={`flex ${t.meta}`}>
                                                {resumeData.personal.email && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-[#1e293b] flex items-center justify-center border border-white/5"><Mail size={10} color="#ffffff" strokeWidth={3} /></div>
                                                        <span className="text-[#ffffff] truncate">{resumeData.personal.email}</span>
                                                    </div>
                                                )}
                                                {resumeData.personal.phone && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-[#1e293b] flex items-center justify-center border border-white/5"><Phone size={10} color="#ffffff" strokeWidth={3} /></div>
                                                        <span className="text-[#ffffff]">{resumeData.personal.phone}</span>
                                                    </div>
                                                )}
                                                {resumeData.personal.location && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-[#1e293b] flex items-center justify-center border border-white/5"><MapPin size={10} color="#ffffff" strokeWidth={3} /></div>
                                                        <span className="text-[#ffffff]">{resumeData.personal.location}</span>
                                                    </div>
                                                )}
                                                {resumeData.personal.linkedin && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-[#1e293b] flex items-center justify-center border border-white/5"><Linkedin size={10} color="#ffffff" strokeWidth={3} /></div>
                                                        <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#818cf8] hover:underline font-bold transition-all">LinkedIn</a>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {resumeData.skills && (
                                            <section className="mb-0">
                                                <h3 className={t.sidebarTitle}>Skills</h3>
                                                <p className="text-[12px] leading-6 text-[#cbd5e1] uppercase tracking-wider whitespace-pre-line font-bold antialiased">{resumeData.skills}</p>
                                            </section>
                                        )}

                                        {resumeData.education.length > 0 && (
                                            <section className="mb-0">
                                                <h3 className={t.sidebarTitle}>Education</h3>
                                                {resumeData.education.map(edu => (
                                                    <div key={edu.id} className="mb-5 last:mb-0 text-[#ffffff]">
                                                        <div className="text-[13px] font-black leading-tight mb-1">{edu.degree}</div>
                                                        <div className="text-[11px] text-[#94a3b8] font-bold italic mb-1">{edu.school}</div>
                                                        <div className="text-[10px] text-[#818cf8] font-black tracking-widest">{edu.year}</div>
                                                    </div>
                                                ))}
                                            </section>
                                        )}
                                    </aside>

                                    {/* MAIN CONTENT */}
                                    <main className={t.main}>
                                        {/* SUMMARY */}
                                        {resumeData.summary && (
                                            <section>
                                                <h2 className={t.sectionTitle}>Profile</h2>
                                                <p className={`${t.body} whitespace-pre-line text-justify`}>{resumeData.summary}</p>
                                            </section>
                                        )}

                                        {/* EXPERIENCE */}
                                        {resumeData.experience.length > 0 && (
                                            <section>
                                                <h2 className={t.sectionTitle}>Experience</h2>
                                                <div className="space-y-8">
                                                    {resumeData.experience.map(exp => (
                                                        <div key={exp.id} className="text-[#0f172a]">
                                                            <div className={t.subTitle}>
                                                                <span className="text-[#0f172a] font-black">{exp.title}</span>
                                                                <span className={t.date}>{exp.startDate} – {exp.endDate}</span>
                                                            </div>
                                                            <div className={t.metaInfo}>{exp.company} | {exp.location}</div>
                                                            <p className={`${t.body} mt-3 whitespace-pre-line text-[#475569] antialiased`}>{exp.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* PROJECTS */}
                                        {resumeData.projects.length > 0 && (
                                            <section>
                                                <h2 className={t.sectionTitle}>Projects</h2>
                                                <div className="space-y-6">
                                                    {resumeData.projects.map(proj => (
                                                        <div key={proj.id}>
                                                            <div className={t.subTitle}>
                                                                <span className="font-black">{proj.name}</span>
                                                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 font-bold uppercase underline tracking-tighter">View Live</a>}
                                                            </div>
                                                            <div className="text-[11px] font-bold text-[#64748b] mb-2 uppercase tracking-wide">{proj.techStack}</div>
                                                            <p className={t.body} style={{ color: '#475569' }}>{proj.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </main>
                                </div>
                            );
                        }

                        // SINGLE COLUMN LAYOUT (Classic / Minimal)
                        return (
                            <div className={t.container} style={{ boxSizing: 'border-box' }}>
                                {/* HEADER */}
                                <header className={t.header}>
                                    <h1 className={t.name}>{resumeData.personal.fullName || "YOUR NAME"}</h1>
                                    <p className={t.title}>{resumeData.personal.jobTitle || "Target Job Title"}</p>

                                    <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 px-10 ${t.meta}`}>
                                        {resumeData.personal.email && (
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={12} className="opacity-70" />
                                                <span>{resumeData.personal.email}</span>
                                            </div>
                                        )}
                                        {resumeData.personal.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone size={12} className="opacity-70" />
                                                <span>{resumeData.personal.phone}</span>
                                            </div>
                                        )}
                                        {resumeData.personal.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={12} className="opacity-70" />
                                                <span>{resumeData.personal.location}</span>
                                            </div>
                                        )}
                                        {resumeData.personal.linkedin && (
                                            <div className="flex items-center gap-1.5 border-b border-black/10">
                                                <Linkedin size={12} className="opacity-70" />
                                                <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                                            </div>
                                        )}
                                        {resumeData.personal.github && (
                                            <div className="flex items-center gap-1.5 border-b border-black/10">
                                                <Github size={12} className="opacity-70" />
                                                <a href={resumeData.personal.github} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>
                                            </div>
                                        )}
                                    </div>
                                </header>

                                {/* SUMMARY */}
                                {resumeData.summary && (
                                    <section className="mb-0">
                                        <h2 className={t.sectionTitle}>Summary</h2>
                                        <p className={`${t.body} whitespace-pre-line text-justify`}>{resumeData.summary}</p>
                                    </section>
                                )}

                                {/* SKILLS */}
                                {resumeData.skills && (
                                    <section className="mb-0">
                                        <h2 className={t.sectionTitle}>Technical Skills</h2>
                                        <p className={`${t.body} whitespace-pre-line font-bold antialiased leading-relaxed`}>{resumeData.skills}</p>
                                    </section>
                                )}

                                {/* EXPERIENCE */}
                                {resumeData.experience.length > 0 && (
                                    <section className="mb-0">
                                        <h2 className={t.sectionTitle}>Experience</h2>
                                        <div className="space-y-6">
                                            {resumeData.experience.map(exp => (
                                                <div key={exp.id}>
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className={t.subTitle}>{exp.title}</h3>
                                                        <span className={t.date}>{exp.startDate} – {exp.endDate}</span>
                                                    </div>
                                                    <div className={t.metaInfo + " mb-2 font-bold opacity-90"}>{exp.company} | {exp.location}</div>
                                                    <p className={`${t.body} whitespace-pre-line`}>{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* PROJECTS */}
                                {resumeData.projects.length > 0 && (
                                    <section className="mb-0">
                                        <h2 className={t.sectionTitle}>Projects</h2>
                                        <div className="space-y-6">
                                            {resumeData.projects.map(proj => (
                                                <div key={proj.id}>
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className={t.subTitle}>
                                                            {proj.name}
                                                        </h3>
                                                        {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-bold hover:underline">Link</a>}
                                                    </div>
                                                    <div className="text-[11px] font-bold text-[#64748b] mb-2 uppercase tracking-wide">{proj.techStack}</div>
                                                    <p className={t.body}>{proj.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* EDUCATION */}
                                {resumeData.education.length > 0 && (
                                    <section className="mb-0">
                                        <h2 className={t.sectionTitle}>Education</h2>
                                        <div className="space-y-4">
                                            {resumeData.education.map(edu => (
                                                <div key={edu.id} className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className={t.subTitle}>{edu.degree}</h3>
                                                        <div className="text-[13px] text-[#4b5563] font-bold italic">{edu.school}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={t.date}>{edu.year}</div>
                                                        {edu.grade && <div className="text-xs font-black text-[#64748b] mt-1">{edu.grade}</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* EXTRAS */}
                                {(resumeData.certifications.length > 0 || resumeData.achievements.length > 0) && (
                                    <section className="mb-0">
                                        <h2 className={t.sectionTitle}>Additional</h2>
                                        <div className="grid grid-cols-2 gap-x-12">
                                            {resumeData.certifications.length > 0 && (
                                                <div>
                                                    <h3 className="text-[11px] font-black uppercase mb-3 opacity-60 flex items-center gap-2">
                                                        <Award size={10} strokeWidth={3} /> Certifications
                                                    </h3>
                                                    <ul className={`list-none space-y-2 ${t.body}`}>
                                                        {resumeData.certifications.map(cert => (
                                                            <li key={cert.id} className="flex flex-col">
                                                                <span className="font-bold text-[#111827] leading-tight mb-0.5">{cert.name}</span>
                                                                <span className="opacity-60 text-[10px] font-black">{cert.year}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {resumeData.achievements.length > 0 && (
                                                <div>
                                                    <h3 className="text-[11px] font-black uppercase mb-3 opacity-60 flex items-center gap-2">
                                                        <Sparkles size={10} strokeWidth={3} /> Key Achievements
                                                    </h3>
                                                    <ul className={`list-none space-y-2 ${t.body}`}>
                                                        {resumeData.achievements.map(ach => (
                                                            <li key={ach.id} className="flex items-start gap-2 before:content-['•'] before:text-purple-500 before:font-black">
                                                                <span className="leading-relaxed">{ach.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>
                        );
                    })()}

                </div>
            </div>
            {/* AI SUGGESTION MODAL */}
            <AnimatePresence>
                {aiSuggestion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#18181b] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-purple-500/10 via-transparent to-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">AI Optimization</h2>
                                        <p className="text-[10px] text-purple-400/80 uppercase tracking-[0.2em] font-black">Enhancing: {aiSuggestion.type}</p>
                                    </div>
                                </div>
                                <button onClick={() => setAiSuggestion(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors opacity-50 hover:opacity-100">
                                    <Trash2 size={20} className="rotate-45" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8 custom-scrollbar max-h-[60vh] overflow-y-auto">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Original Draft</label>
                                    <div className="p-5 bg-white/[0.02] rounded-2xl text-sm text-gray-400 border border-white/5 italic leading-relaxed">
                                        "{aiSuggestion.original}"
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">AI Refinement</label>
                                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">ATS Optimized</span>
                                    </div>
                                    <div className="p-6 bg-purple-500/5 rounded-2xl text-white text-[15px] leading-relaxed border border-purple-500/20 ring-1 ring-purple-500/10 whitespace-pre-line shadow-inner">
                                        {aiSuggestion.enhanced}
                                    </div>

                                    {aiSuggestion.warning && (
                                        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                                            <div className="p-1 bg-amber-500/20 rounded-lg shrink-0 mt-0.5">
                                                <Award size={14} className="text-amber-400" />
                                            </div>
                                            <p className="text-[11px] text-amber-200/80 leading-relaxed font-medium">{aiSuggestion.warning}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
                                <button
                                    onClick={() => setAiSuggestion(null)}
                                    className="flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold text-gray-400"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={applyAISuggestion}
                                    className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm font-black text-white active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Apply Refinement <ChevronRight size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
