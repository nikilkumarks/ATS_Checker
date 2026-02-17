import React, { useState, useRef, useEffect } from 'react';
import API_URL from '../api/config';
import { useNavigate } from 'react-router-dom';
import {
    Wand2, ChevronRight, ChevronLeft, Download, Plus, Trash2, Layout,
    User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Globe, Languages,
    Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Sparkles, X, CheckCircle2,
    Sun, Moon
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import './ResumeBuilder.css';

export default function ResumeBuilder() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
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
            const res = await fetch(`${API_URL}/api/ai/enhance`, {
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
            case 0: // Personal Information
                return (
                    <div className="space-y-8 animate-spring">
                        <header className="space-y-2">
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Personal <span className="text-primary">Details</span></h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">The foundation of your resume</p>
                        </header>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input type="text" placeholder="e.g. Alexander Pierce" className="input-field" value={resumeData.personal.fullName || ""} onChange={(e) => handlePersonalChange('fullName', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Desired Job Title</label>
                                        <button onClick={() => handleAIEnhance('jobTitle', resumeData.personal.jobTitle, 'jobTitle')} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1"><Sparkles size={10} /> AI Refine</button>
                                    </div>
                                    <input type="text" placeholder="e.g. Senior Software Architect" className="input-field" value={resumeData.personal.jobTitle || ""} onChange={(e) => handlePersonalChange('jobTitle', e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <input type="email" placeholder="alex@example.com" className="input-field" value={resumeData.personal.email || ""} onChange={(e) => handlePersonalChange('email', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                                    <input type="text" placeholder="+1 (555) 000-0000" className="input-field" value={resumeData.personal.phone || ""} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                                <input type="text" placeholder="San Francisco, CA" className="input-field" value={resumeData.personal.location || ""} onChange={(e) => handlePersonalChange('location', e.target.value)} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">LinkedIn Profile</label>
                                    <div className="relative">
                                        <Linkedin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                        <input type="text" placeholder="linkedin.com/in/username" className="input-field pl-12" value={resumeData.personal.linkedin || ""} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Portfolio / GitHub</label>
                                    <div className="relative">
                                        <Github size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                        <input type="text" placeholder="github.com/username" className="input-field pl-12" value={resumeData.personal.github || ""} onChange={(e) => handlePersonalChange('github', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 1: // Summary
                return (
                    <div className="space-y-8 animate-spring">
                        <header className="flex justify-between items-end">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Professional <span className="text-primary">Bio</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Your 30-second elevator pitch</p>
                            </div>
                            <button onClick={() => handleAIEnhance('summary', resumeData.summary, 'summary')} disabled={loading} className="ai-btn py-2">
                                <Sparkles size={16} /> {loading ? "Optimizing..." : "AI Optimize"}
                            </button>
                        </header>

                        <div className="relative group">
                            <textarea
                                className="textarea-field h-64 custom-scrollbar text-lg font-medium leading-relaxed italic"
                                placeholder="e.g. Results-driven Software Engineer with 5+ years of experience in building scalable web applications. Expert in architectural design and cross-functional leadership..."
                                value={resumeData.summary}
                                onChange={(e) => handleSimpleChange('summary', e.target.value)}
                            />
                            <div className="absolute bottom-6 right-6 px-3 py-1 bg-background/50 backdrop-blur-sm border border-border rounded-full text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                {resumeData.summary.length} characters
                            </div>
                        </div>
                    </div>
                );

            case 2: // Experience
                return (
                    <div className="space-y-8 animate-spring">
                        <header className="flex justify-between items-end">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Work <span className="text-primary">History</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Proof of your professional impact</p>
                            </div>
                            <button onClick={addExperience} className="ai-btn-sm py-2">
                                <Plus size={16} /> Add Role
                            </button>
                        </header>

                        <div className="space-y-6">
                            {resumeData.experience.map((exp, index) => (
                                <div key={exp.id} className="card-input group overflow-hidden">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
                                                0{index + 1}
                                            </div>
                                            <h4 className="font-black text-xs uppercase tracking-widest text-foreground">Position Details</h4>
                                        </div>
                                        <button onClick={() => removeItem('experience', exp.id)} className="delete-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Title</label>
                                            <input type="text" placeholder="e.g. Lead Developer" className="input-field" value={exp.title || ""} onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Company</label>
                                            <input type="text" placeholder="e.g. Microsoft" className="input-field" value={exp.company || ""} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Start Date</label>
                                            <input type="text" placeholder="Jan 2020" className="input-field" value={exp.startDate || ""} onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">End Date</label>
                                            <input type="text" placeholder="Present" className="input-field" value={exp.endDate || ""} onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Achievements & Impact</label>
                                            <button onClick={() => handleAIEnhance('experience', exp.description, 'experience', exp.id)} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1.5">
                                                <Sparkles size={12} /> AI Rewrite
                                            </button>
                                        </div>
                                        <textarea
                                            placeholder="• Scaled core platform to 1M+ active users..."
                                            className="textarea-field h-40 custom-scrollbar text-sm"
                                            value={exp.description || ""}
                                            onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 3: // Projects
                return (
                    <div className="space-y-8 animate-spring">
                        <header className="flex justify-between items-end">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Notable <span className="text-primary">Projects</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Case studies of your expertise</p>
                            </div>
                            <button onClick={addProject} className="ai-btn-sm py-2">
                                <Plus size={16} /> Add Project
                            </button>
                        </header>

                        <div className="space-y-6">
                            {resumeData.projects.map((proj, index) => (
                                <div key={proj.id} className="card-input group">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
                                                0{index + 1}
                                            </div>
                                            <h4 className="font-black text-xs uppercase tracking-widest text-foreground">Project Profile</h4>
                                        </div>
                                        <button onClick={() => removeItem('projects', proj.id)} className="delete-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Project Name</label>
                                            <input type="text" placeholder="e.g. AI Content Engine" className="input-field" value={proj.name || ""} onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tech Stack</label>
                                            <input type="text" placeholder="e.g. Next.js, OpenAI, PostgreSQL" className="input-field" value={proj.techStack || ""} onChange={(e) => updateItem('projects', proj.id, 'techStack', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Outcome & Contribution</label>
                                            <button onClick={() => handleAIEnhance('projects', proj.description, 'projects', proj.id)} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1.5">
                                                <Sparkles size={12} /> AI Rewrite
                                            </button>
                                        </div>
                                        <textarea
                                            placeholder="Decreased processing time by 45% by implementing a custom caching layer..."
                                            className="textarea-field h-32 custom-scrollbar text-sm"
                                            value={proj.description || ""}
                                            onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 4: // Education
                return (
                    <div className="space-y-8 animate-spring">
                        <header className="flex justify-between items-end">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Academic <span className="text-primary">Path</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Your educational foundation</p>
                            </div>
                            <button onClick={addEducation} className="ai-btn-sm py-2">
                                <Plus size={16} /> Add School
                            </button>
                        </header>

                        <div className="space-y-6">
                            {resumeData.education.map((edu, index) => (
                                <div key={edu.id} className="card-input group">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
                                                0{index + 1}
                                            </div>
                                            <h4 className="font-black text-xs uppercase tracking-widest text-foreground">Scholar Info</h4>
                                        </div>
                                        <button onClick={() => removeItem('education', edu.id)} className="delete-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Degree & Major</label>
                                            <input type="text" placeholder="e.g. Master of Computer Science" className="input-field" value={edu.degree || ""} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Institution</label>
                                            <input type="text" placeholder="e.g. MIT" className="input-field" value={edu.school || ""} onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Graduation Year</label>
                                                <input type="text" placeholder="e.g. 2022" className="input-field" value={edu.year || ""} onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">GPA / Honors</label>
                                                <input type="text" placeholder="e.g. 3.9 / Cum Laude" className="input-field" value={edu.grade || ""} onChange={(e) => updateItem('education', edu.id, 'grade', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 5: // Skills
                return (
                    <div className="space-y-8 animate-spring">
                        <header className="flex justify-between items-end">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Core <span className="text-primary">Skills</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Your technical toolkit</p>
                            </div>
                            <button onClick={() => handleAIEnhance('skills', resumeData.skills, 'skills')} disabled={loading} className="ai-btn py-2">
                                <Sparkles size={16} /> {loading ? "Optimizing..." : "Analyze for ATS"}
                            </button>
                        </header>

                        <div className="space-y-6">
                            <textarea
                                className="textarea-field h-64 custom-scrollbar font-mono text-base leading-relaxed"
                                placeholder="Languages: JavaScript, Python, Rust\nFrameworks: React, Next.js, Node.js\nCore: Distributed Systems, AWS, CI/CD"
                                value={resumeData.skills}
                                onChange={(e) => handleSimpleChange('skills', e.target.value)}
                            />

                            <div className="p-6 bg-primary/5 rounded-[28px] border border-primary/10 flex items-start gap-5">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Wand2 size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-primary">ATS Optimization Tip</h4>
                                    <p className="text-sm text-foreground/70 leading-relaxed italic">
                                        Structure your skills by categories to help parsers rank you higher for specific job descriptions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 6: // Extras
                return (
                    <div className="space-y-12 animate-spring">
                        <header className="space-y-2">
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Extra <span className="text-primary">Details</span></h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">The finishing touches that set you apart</p>
                        </header>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Award size={20} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Certifications</h3>
                                </div>
                                <button onClick={addCertification} className="ai-btn-sm py-2">
                                    <Plus size={16} /> Add Cert
                                </button>
                            </div>

                            <div className="space-y-4">
                                {resumeData.certifications.map((cert) => (
                                    <div key={cert.id} className="card-input group flex items-end gap-4">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Certificate Name</label>
                                            <input type="text" placeholder="e.g. AWS Solutions Architect" className="input-field" value={cert.name || ""} onChange={(e) => updateItem('certifications', cert.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="w-1/3 space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Year</label>
                                            <input type="text" placeholder="2023" className="input-field" value={cert.year || ""} onChange={(e) => updateItem('certifications', cert.id, 'year', e.target.value)} />
                                        </div>
                                        <button onClick={() => removeItem('certifications', cert.id)} className="delete-btn mb-1.5">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Sparkles size={20} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Key Achievements</h3>
                                </div>
                                <button onClick={addAchievement} className="ai-btn-sm py-2">
                                    <Plus size={16} /> Add Win
                                </button>
                            </div>

                            <div className="space-y-4">
                                {resumeData.achievements.map((ach) => (
                                    <div key={ach.id} className="card-input group flex items-center gap-4">
                                        <div className="flex-1">
                                            <input type="text" placeholder="e.g. Increased revenue by 25% through A/B testing..." className="input-field" value={ach.title || ""} onChange={(e) => updateItem('achievements', ach.id, 'title', e.target.value)} />
                                        </div>
                                        <button onClick={() => removeItem('achievements', ach.id)} className="delete-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 7: // Finish / Templates
                return (
                    <div className="space-y-8 animate-spring">
                        <header className="space-y-2">
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Ready for <span className="text-primary">Impact</span></h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Select a layout and claim your future</p>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { id: 'classic', name: 'Standard ATS', desc: 'Maximum Parsing Rate', icon: Layout },
                                { id: 'modern', name: 'Modern Clean', desc: 'Perfect for High-Tech', icon: Layout },
                                { id: 'minimal', name: 'Minimalist', desc: 'Focus on Experience', icon: Layout }
                            ].map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={`relative p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-500 group overflow-hidden ${selectedTemplate === t.id ? 'border-primary bg-primary/10 shadow-[0_20px_50px_rgba(var(--primary),0.2)] scale-[1.02]' : 'border-border bg-card/40 hover:border-primary/30 hover:bg-card/60'}`}
                                >
                                    {selectedTemplate === t.id && (
                                        <div className="absolute top-4 right-4 text-primary animate-in fade-in zoom-in duration-300">
                                            <CheckCircle2 size={24} fill="currentColor" className="text-primary-foreground stroke-primary" />
                                        </div>
                                    )}

                                    <div className={`w-full aspect-video rounded-2xl mb-6 flex items-center justify-center transition-all duration-500 group-hover:scale-105 ${selectedTemplate === t.id ? 'bg-primary/20' : 'bg-secondary/50'}`}>
                                        <t.icon size={48} strokeWidth={1} className={selectedTemplate === t.id ? "text-primary" : "text-muted-foreground/30"} />
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm uppercase tracking-widest text-foreground">{t.name}</h4>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 space-y-4">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={loading}
                                className={`w-full py-6 rounded-[24px] bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground font-black text-xl shadow-[0_20px_40px_rgba(var(--primary),0.3)] hover:shadow-[0_25px_50px_rgba(var(--primary),0.4)] hover:-translate-y-1.5 transition-all active:scale-[0.98] flex justify-center items-center gap-4 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                        <span>Forging Excellence...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={28} strokeWidth={3} />
                                        <span>Download Performance Resume</span>
                                    </>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                                <Sparkles size={12} className="text-primary" /> Validated for ATS Performance <Sparkles size={12} className="text-primary" />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderTemplate = () => {
        const { personal, summary, experience, projects, education, skills, certifications, achievements } = resumeData;

        return (
            <div className="p-12 space-y-10 text-slate-800 font-sans leading-relaxed">
                <header className="border-b-4 border-slate-900 pb-8">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{personal.fullName || 'YOUR NAME'}</h1>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                        {personal.jobTitle && <span className="text-slate-900">{personal.jobTitle}</span>}
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                        {personal.location && <span>{personal.location}</span>}
                    </div>
                </header>

                {summary && (
                    <section className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">Professional Profile</h2>
                        <p className="text-lg italic leading-relaxed">{summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-12">
                    <div className="col-span-2 space-y-12">
                        {experience.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">Experience</h2>
                                {experience.map(exp => (
                                    <div key={exp.id} className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-xl font-black text-slate-900">{exp.title}</h3>
                                            <span className="text-sm font-black text-slate-400">{exp.startDate} — {exp.endDate}</span>
                                        </div>
                                        <p className="text-md font-bold text-primary italic uppercase tracking-wider">{exp.company}</p>
                                        <p className="whitespace-pre-line text-slate-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {projects.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">Key Projects</h2>
                                {projects.map(proj => (
                                    <div key={proj.id} className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-lg font-black text-slate-900">{proj.name}</h3>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{proj.techStack}</span>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed italic">{proj.description}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>

                    <div className="space-y-12">
                        {skills ? (
                            <section className="space-y-6">
                                <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">Skills</h2>
                                <p className="text-sm font-bold text-slate-600 leading-loose uppercase tracking-widest whitespace-pre-line">{skills}</p>
                            </section>
                        ) : null}

                        {education.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">Education</h2>
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="text-md font-black text-slate-900">{edu.degree}</h3>
                                        <p className="text-sm font-bold text-slate-500">{edu.school}</p>
                                        <p className="text-xs font-black text-primary uppercase tracking-widest mt-1">{edu.year} · {edu.grade}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {(certifications.length > 0 || achievements.length > 0) && (
                            <section className="space-y-6">
                                <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">Extras</h2>
                                <div className="space-y-4">
                                    {certifications.map(cert => (
                                        <div key={cert.id} className="text-slate-600">
                                            <p className="text-sm font-black">{cert.name}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{cert.year}</p>
                                        </div>
                                    ))}
                                    {achievements.map(ach => (
                                        <div key={ach.id} className="text-slate-600 italic text-sm">
                                            • {ach.title}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <Navbar />

            <div className="flex flex-col md:flex-row flex-1 pt-16">
                {/* AMBIENT BACKGROUND ELEMENTS */}
                <div className="fixed inset-0 pointer-events-none opacity-40">
                    <div className="blob bg-primary/20 top-[-10%] left-[-10%] w-[60%] h-[60%]" />
                    <div className="blob bg-indigo-600/20 bottom-[-10%] right-[-10%] w-[60%] h-[60%] animate-pulse" />
                </div>

                {/* LEFT SIDE: STEPS & EDITOR */}
                <div
                    className="w-full md:w-1/2 flex flex-col h-[calc(100vh-64px)] border-r border-border relative z-10 backdrop-blur-md"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--background), transparent 50%)' }}
                >
                    <header className="p-8 border-b border-border flex justify-between items-center bg-card/30 sticky top-0 z-30 backdrop-blur-xl">
                        <button onClick={() => navigate('/dashboard')} className="p-3 rounded-2xl bg-secondary border border-border hover:bg-accent transition-all active:scale-90">
                            <ChevronLeft size={20} className="text-foreground" />
                        </button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-sm font-black italic uppercase tracking-widest text-primary leading-none mb-1">Resume <span className="text-foreground">Forge</span></h2>
                            <div className="flex gap-1.5">
                                {steps.map((_, i) => (
                                    <div key={i} className={`step-dot ${i === activeStep ? 'step-dot-active' : 'step-dot-inactive'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="w-11" /> {/* Spacer instead of toggle */}
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                        <div className="max-w-xl mx-auto py-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="min-h-[500px]"
                                >
                                    {renderEditor()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="p-8 border-t border-border flex justify-between bg-card/30 backdrop-blur-xl sticky bottom-0 z-30">
                        <button
                            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                            disabled={activeStep === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all font-bold text-sm uppercase tracking-widest ${activeStep === 0 ? 'opacity-0 pointer-events-none' : 'border-border text-muted-foreground hover:bg-secondary'}`}
                        >
                            <ChevronLeft size={18} /> Back
                        </button>

                        <button
                            onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                            className={`bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold flex items-center gap-2 group transition-all hover:opacity-90 active:scale-95 ${activeStep === steps.length - 1 ? 'hidden' : ''}`}
                        >
                            <span>{activeStep === steps.length - 2 ? 'Finalize' : 'Next Step'}</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL: LIVE PREVIEW */}
                <div
                    className={`
                        ${activeStep === 7 ? 'fixed inset-0 z-[60] backdrop-blur-xl p-6 pt-24 custom-scrollbar overflow-y-auto' : 'hidden'} 
                        md:static md:flex md:flex-1 md:bg-secondary/30 md:h-[calc(100vh-64px)] md:flex-col md:relative md:z-0 md:overflow-hidden
                    `}
                    style={activeStep === 7 ? { backgroundColor: 'color-mix(in srgb, var(--background), transparent 5%)' } : {}}
                >
                    <div className="p-8 border-b border-border bg-card/50 backdrop-blur-sm flex justify-between items-center relative z-10 w-full hidden md:flex">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <Layout size={18} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Live Preview <span className="text-muted-foreground opacity-50 ml-1">· Real-time</span></h3>
                        </div>

                        {activeStep === 7 && (
                            <div className="flex gap-3">
                                <button onClick={handleDownloadPDF} disabled={loading} className="ai-btn px-6">
                                    <Download size={18} className={loading ? 'animate-bounce' : ''} />
                                    <span>{loading ? 'Forging PDF...' : 'Download Resume'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Close Button (Step 7) */}
                    {activeStep === 7 && (
                        <button
                            onClick={() => setActiveStep(6)}
                            className="md:hidden absolute top-6 right-6 p-3 bg-secondary/80 hover:bg-secondary rounded-2xl text-foreground z-[70] backdrop-blur-md border border-border active:scale-95 transition-all"
                        >
                            <X size={24} />
                        </button>
                    )}


                    <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-primary/5 w-full flex justify-center">
                        <div className={`
                        preview-container origin-top
                        ${activeStep === 7 ? 'scale-100 mt-12 mb-24' : 'scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-100'} 
                        shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]
                    `}>
                            <div id="resume-preview" className="bg-white">
                                {renderTemplate()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI SUGGESTION MODAL */}
                <AnimatePresence>
                    {aiSuggestion && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--background), transparent 20%)' }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-card border border-border rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl"
                            >
                                <div className="p-8 border-b border-border flex items-center justify-between bg-gradient-to-br from-primary/10 via-transparent to-transparent">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-primary/20 rounded-2xl text-primary">
                                            <Sparkles size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">AI <span className="text-primary">Optimization</span></h2>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Enhancing your {aiSuggestion.type}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setAiSuggestion(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                        <Trash2 size={24} className="rotate-45 text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="p-8 space-y-8 custom-scrollbar max-h-[60vh] overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Original Version</label>
                                            <div className="p-5 bg-background border border-border rounded-2xl text-sm text-muted-foreground italic leading-relaxed">
                                                "{aiSuggestion.original}"
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center ml-1">
                                                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Optimized Result</label>
                                                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">ATS Ready</span>
                                            </div>
                                            <div className="p-6 bg-primary/5 rounded-2xl text-foreground text-[15px] leading-relaxed border border-primary/20 shadow-inner whitespace-pre-line font-medium">
                                                {aiSuggestion.enhanced}
                                            </div>
                                        </div>
                                    </div>

                                    {aiSuggestion.warning && (
                                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                                            <div className="p-2 bg-amber-500/20 rounded-xl shrink-0">
                                                <Award size={18} className="text-amber-400" />
                                            </div>
                                            <p className="text-xs text-amber-500/90 leading-relaxed font-medium">{aiSuggestion.warning}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 bg-secondary/30 border-t border-border flex gap-4">
                                    <button
                                        onClick={() => setAiSuggestion(null)}
                                        className="flex-1 py-4 rounded-2xl border border-border hover:bg-secondary transition-all text-sm font-bold text-muted-foreground"
                                    >
                                        Dismiss Changes
                                    </button>
                                    <button
                                        onClick={applyAISuggestion}
                                        className="flex-[1.5] py-4 rounded-2xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Apply Optimization <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
