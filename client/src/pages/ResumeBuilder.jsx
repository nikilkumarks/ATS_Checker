import React, { useState, useRef, useEffect } from 'react';
import API_URL from '../api/config';
import { useNavigate } from 'react-router-dom';
import {
    Wand2, ChevronRight, ChevronLeft, Download, Plus, Trash2, Layout,
    User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Globe, Languages,
    Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Sparkles, X, CheckCircle2,
    Sun, Moon, Activity
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
            { id: 1, title: "Senior Software Engineer", company: "Tata Consultancy Services (TCS)", location: "Bangalore, India", startDate: "Jun 2021", endDate: "Present", description: "• Led development of a high-traffic e-commerce platform using React.js and Node.js.\n• Mentored a team of 5 junior developers and improved code quality through rigorous PR reviews." }
        ],
        projects: [
            { id: 1, name: "Smart City Traffic Management", techStack: "Python, IoT, TensorFlow", description: "Developed an AI-based system to optimize traffic flow in Mumbai using real-time sensor data." }
        ],
        education: [
            { id: 1, degree: "B.Tech in Computer Science", school: "Indian Institute of Technology (IIT) Delhi", year: "2021", grade: "9.2 CGPA" }
        ],
        certifications: [
            { id: 1, name: "AWS Certified Solutions Architect", year: "2023" }
        ],
        achievements: [
            { id: 1, title: "Winner of All-India Smart City Hackathon 2022" }
        ],
        languages: []
    });

    const steps = [
        { title: "Contact", icon: <User size={18} />, key: "personal" },
        { title: "Summary", icon: <Briefcase size={18} />, key: "summary" },
        { title: "Jobs", icon: <Briefcase size={18} />, key: "experience" },
        { title: "Projects", icon: <FolderGit2 size={18} />, key: "projects" },
        { title: "School", icon: <GraduationCap size={18} />, key: "education" },
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
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">About <span className="text-primary">You</span></h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Basics for your contact info</p>
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Your <span className="text-primary">Summary</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Explain what you do best</p>
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Job <span className="text-primary">History</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Write about your past work</p>
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Your <span className="text-primary">Projects</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Show off what you built</p>
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">School <span className="text-primary">Info</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Where you studied</p>
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Your <span className="text-primary">Skills</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">List what you can do</p>
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
                                        <span>Building Your Resume...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={28} strokeWidth={3} />
                                        <span>Download Resume</span>
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

        const LayoutHeader = () => (
            <header className={`border-b-2 pb-5 ${theme === 'dark' ? 'border-primary/30' : 'border-slate-900'}`}>
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 leading-none">{personal.fullName || 'YOUR NAME'}</h1>
                <div className={`flex flex-wrap gap-x-4 gap-y-1 text-[8px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {personal.jobTitle && <span className={theme === 'dark' ? 'text-primary' : 'text-slate-900'}>{personal.jobTitle}</span>}
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>{personal.location}</span>}
                    {personal.linkedin && <span className="lowercase opacity-50">{personal.linkedin}</span>}
                    {personal.github && <span className="lowercase opacity-50">{personal.github}</span>}
                </div>
            </header>
        );

        const Section = ({ title, children }) => (
            <section className="space-y-2">
                <h2 className="text-[9px] font-black uppercase tracking-[0.2em] border-l-4 border-primary pl-2">{title}</h2>
                <div className="space-y-3">{children}</div>
            </section>
        );

        if (selectedTemplate === 'modern') {
            return (
                <div className={`w-full h-full flex transition-colors duration-500 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    <div className={`w-[30%] p-6 space-y-6 h-full ${theme === 'dark' ? 'bg-zinc-900 border-r border-white/5' : 'bg-slate-50 border-r border-slate-200'}`}>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">{personal.fullName || 'NAME'}</h1>
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary mt-1">{personal.jobTitle}</p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <h3 className="text-[8px] font-black uppercase tracking-widest opacity-40">Contact</h3>
                            <div className="space-y-1 text-[8px] font-bold break-words uppercase">
                                <p className="truncate">{personal.email}</p>
                                <p>{personal.phone}</p>
                                <p className="truncate">{personal.location}</p>
                                {personal.linkedin && <p className="truncate lowercase text-[7px] opacity-40">{personal.linkedin}</p>}
                                {personal.github && <p className="truncate lowercase text-[7px] opacity-40">{personal.github}</p>}
                            </div>
                        </div>

                        {skills && (
                            <div className="space-y-3">
                                <h3 className="text-[8px] font-black uppercase tracking-widest opacity-40">Expertise</h3>
                                <p className="text-[8px] font-bold leading-relaxed uppercase tracking-widest whitespace-pre-line">{skills}</p>
                            </div>
                        )}

                        {education.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[8px] font-black uppercase tracking-widest opacity-40">Education</h3>
                                {education.map(edu => (
                                    <div key={edu.id} className="space-y-0.5">
                                        <p className="text-[9px] font-black leading-tight uppercase">{edu.degree}</p>
                                        <p className="text-[8px] font-bold opacity-50 uppercase">{edu.school} · {edu.year}</p>
                                        {edu.grade && <p className="text-[7px] font-black text-primary uppercase">{edu.grade}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar h-full">
                        {summary && <p className="text-[10px] italic leading-relaxed opacity-70 border-b border-border/10 pb-3">{summary}</p>}

                        {experience.length > 0 && (
                            <Section title="Experience">
                                <div className="space-y-3">
                                    {experience.map(exp => (
                                        <div key={exp.id} className="space-y-1">
                                            <h4 className="font-black uppercase text-[10px] tracking-widest">{exp.title}</h4>
                                            <p className="text-[8px] font-black text-primary uppercase">{exp.company} | {exp.startDate} — {exp.endDate}</p>
                                            <p className="text-[9px] leading-relaxed opacity-70 whitespace-pre-line">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {projects.length > 0 && (
                            <Section title="Selected Projects">
                                <div className="space-y-3">
                                    {projects.map(proj => (
                                        <div key={proj.id} className="space-y-0.5">
                                            <h4 className="font-black uppercase text-[9px] tracking-widest">{proj.name}</h4>
                                            <p className="text-[8px] font-bold text-primary uppercase">{proj.techStack}</p>
                                            <p className="text-[9px] leading-relaxed opacity-70 whitespace-pre-line">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {(certifications.length > 0 || achievements.length > 0) && (
                            <Section title="Honors & Certs">
                                <div className="space-y-1 text-[9px] font-bold opacity-70 italic leading-tight">
                                    {certifications.map(c => <p key={c.id}>• {c.name} ({c.year})</p>)}
                                    {achievements.map(a => <p key={a.id}>• {a.title}</p>)}
                                </div>
                            </Section>
                        )}
                    </div>
                </div>
            );
        }

        if (selectedTemplate === 'minimal') {
            return (
                <div className={`p-[15mm] space-y-5 font-serif w-full h-full text-center transition-colors duration-500 overflow-y-auto custom-scrollbar ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    <header className="space-y-2">
                        <h1 className="text-3xl font-light tracking-[0.2em] uppercase">{personal.fullName || 'YOUR NAME'}</h1>
                        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[7px] uppercase tracking-[0.3em] opacity-40">
                            <span>{personal.location}</span>
                            <span>{personal.email}</span>
                            <span>{personal.phone}</span>
                            {personal.linkedin && <span>{personal.linkedin}</span>}
                        </div>
                    </header>
                    <div className="max-w-2xl mx-auto space-y-5 text-left pb-10">
                        {summary && <p className="text-[9px] italic leading-relaxed text-center opacity-60 border-y border-border/10 py-3">{summary}</p>}

                        {experience.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[8px] font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-0.5">Experience</h3>
                                {experience.map(exp => (
                                    <div key={exp.id} className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-[10px] uppercase tracking-widest">{exp.title} | <span className="text-primary/70">{exp.company}</span></h4>
                                            <span className="text-[7px] uppercase tracking-widest opacity-40">{exp.startDate} — {exp.endDate}</span>
                                        </div>
                                        <p className="text-[9px] leading-normal opacity-70 whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {projects.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[8px] font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-0.5">Key Projects</h3>
                                {projects.map(proj => (
                                    <div key={proj.id} className="space-y-0.5">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-[9px] uppercase tracking-widest">{proj.name}</h4>
                                            <span className="text-[7px] uppercase tracking-widest opacity-40">{proj.techStack}</span>
                                        </div>
                                        <p className="text-[8px] leading-relaxed opacity-60 italic whitespace-pre-line">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-border/10">
                            {education.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-[8px] font-black uppercase tracking-widest text-primary">Education</h3>
                                    {education.map(edu => (
                                        <div key={edu.id} className="space-y-0.5">
                                            <p className="text-[9px] font-bold uppercase">{edu.degree}</p>
                                            <p className="text-[7px] opacity-50 uppercase tracking-widest">{edu.school} | {edu.year} | {edu.grade}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-3">
                                <h3 className="text-[8px] font-black uppercase tracking-widest text-primary">Details</h3>
                                <div className="space-y-2">
                                    {skills && <p className="text-[8px] leading-tight uppercase tracking-widest opacity-50">{skills}</p>}
                                    <div className="space-y-0.5 opacity-40 italic text-[7px]">
                                        {achievements.slice(0, 3).map(a => <p key={a.id}>• {a.title}</p>)}
                                        {certifications.slice(0, 2).map(c => <p key={c.id}>• {c.name}</p>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // CLASSIC / DEFAULT
        return (
            <div className={`p-[15mm] space-y-6 font-sans leading-relaxed transition-colors duration-500 w-full h-full overflow-y-auto custom-scrollbar ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                <LayoutHeader />
                {summary && <p className="text-[10px] italic leading-relaxed border-b border-border/10 pb-3">{summary}</p>}
                <div className="grid grid-cols-3 gap-8 pb-10">
                    <div className="col-span-2 space-y-6">
                        <Section title="Professional Experience">
                            <div className="space-y-4">
                                {experience.map(exp => (
                                    <div key={exp.id} className="space-y-1">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-[11px] font-black uppercase tracking-tight">{exp.title}</h3>
                                            <span className="text-[8px] font-black opacity-30 uppercase">{exp.startDate} — {exp.endDate}</span>
                                        </div>
                                        <p className="text-[9px] font-black text-primary uppercase italic leading-none">{exp.company} | {exp.location}</p>
                                        <p className="text-[9px] leading-relaxed opacity-70 whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {projects.length > 0 && (
                            <Section title="Featured Projects">
                                <div className="space-y-3">
                                    {projects.map(proj => (
                                        <div key={proj.id} className="space-y-0.5">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-black text-[10px] uppercase tracking-wider">{proj.name}</h4>
                                                <span className="text-[8px] font-bold text-primary uppercase opacity-60">{proj.techStack}</span>
                                            </div>
                                            <p className="text-[9px] leading-snug opacity-60 whitespace-pre-line">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}
                    </div>
                    <div className="space-y-6">
                        <Section title="Skills">
                            <p className="text-[8px] font-bold leading-normal uppercase tracking-widest whitespace-pre-line opacity-60">{skills}</p>
                        </Section>
                        <Section title="Education">
                            <div className="space-y-2">
                                {education.map(edu => (
                                    <div key={edu.id} className="space-y-0.5">
                                        <h4 className="text-[10px] font-black uppercase leading-tight">{edu.degree}</h4>
                                        <p className="text-[8px] font-bold opacity-50 uppercase">{edu.school}</p>
                                        <p className="text-[8px] font-black text-primary uppercase tracking-widest">{edu.year} · {edu.grade}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                        {(certifications.length > 0 || achievements.length > 0) && (
                            <Section title="Honors">
                                <div className="space-y-1.5 text-[8px] font-bold opacity-40 uppercase tracking-tighter leading-tight">
                                    {certifications.map(c => <p key={c.id}>• {c.name}</p>)}
                                    {achievements.map(a => <p key={a.id}>• {a.title}</p>)}
                                </div>
                            </Section>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-primary/30 transition-colors duration-300 overflow-x-hidden">
            <Navbar />

            <div className="flex flex-1 pt-16 h-[calc(100vh)] overflow-hidden relative">
                {/* PREMUIM AMBIENT BACKGROUND */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/5 blur-[140px] rounded-full animate-glow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 blur-[140px] rounded-full animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                </div>

                {/* SIDEBAR REMOVED FOR FULL WIDTH EXPERIENCE */}

                {/* CENTER AREA: FULL-WIDTH EDITOR */}
                <div className="flex-[1.2] flex flex-col relative z-10 bg-transparent overflow-hidden border-r border-white/5">

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0 md:p-12">
                        <div className="w-full px-8 md:px-16 pb-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.02, y: -20 }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                    className="min-h-[600px]"
                                >
                                    <div className="p-1 w-fit rounded-full bg-white/5 border border-white/10 mb-10 flex items-center gap-3 pr-5 backdrop-blur-md">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-black shadow-lg shadow-primary/20">
                                            {activeStep + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary leading-none mb-0.5">Workspace</span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 leading-none">Sector {activeStep + 1}</span>
                                        </div>
                                    </div>

                                    {renderEditor()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <footer className="p-8 bg-card/60 border-t border-border/50 backdrop-blur-3xl flex justify-between items-center shrink-0 shadow-2xl relative z-20">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-10 py-5 rounded-2xl border border-border/50 bg-secondary/30 hover:bg-secondary/50 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-3 group mr-4"
                        >
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Abort
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                                disabled={activeStep === 0}
                                className={`px-10 py-5 rounded-2xl border transition-all font-black text-[9px] uppercase tracking-[0.4em] ${activeStep === 0
                                    ? 'opacity-0 pointer-events-none'
                                    : 'border-border/50 text-muted-foreground hover:bg-secondary/30 hover:text-foreground active:scale-95'
                                    }`}
                            >
                                Revert
                            </button>

                            <div className="hidden lg:flex flex-col items-center gap-2.5 mx-8">
                                <div className="flex gap-2">
                                    {steps.map((_, i) => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${i <= activeStep ? 'bg-primary scale-125 shadow-[0_0_12px_rgba(var(--primary),0.6)]' : 'bg-border/50'}`} />
                                    ))}
                                </div>
                            </div>

                            {activeStep < steps.length - 1 ? (
                                <button
                                    onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                                    className="bg-primary text-primary-foreground px-14 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    <span className="relative z-10">{activeStep === steps.length - 2 ? 'Finalize Forge' : 'Continue'}</span>
                                    <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform relative z-10" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={loading}
                                    className="bg-emerald-600 text-white px-14 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-emerald-600/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                                    <Download size={18} strokeWidth={3} className={loading ? 'animate-bounce' : ''} />
                                    <span>{loading ? 'Forging...' : 'Extract Resume'}</span>
                                </button>
                            )}
                        </div>
                    </footer>
                </div>

                {/* RIGHT PANEL: FULL-HEIGHT PREVIEW */}
                <div className="flex-1 bg-background hidden lg:flex flex-col relative z-20 overflow-hidden border-l border-border/50">
                    {/* AMBIENT GLOW BEHIND SHEET */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 flex items-start justify-center relative">
                        {/* PHYSICAL A4 PAPER PREVIEW */}
                        <div className="a4-sheet-container">
                            <div className="relative group transition-all duration-700 hover:-translate-y-4">
                                {/* REALISTIC PAPER DEPTH SHADOWS */}
                                <div className="absolute top-10 left-10 right-10 bottom-0 bg-black/60 blur-[100px] opacity-50 group-hover:opacity-70 transition-opacity" />
                                <div className="absolute top-4 left-4 right-4 bottom-0 bg-black/40 blur-[40px]" />

                                <div className="a4-sheet overflow-hidden bg-white relative z-10 ring-1 ring-border/10">
                                    {/* PHYSICAL PAPER GRAIN */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

                                    {/* DOCUMENT SHINE REFLECTION */}
                                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10" />

                                    <div id="resume-preview" className={`${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-slate-900'} w-full h-full origin-top transition-transform duration-500`}>
                                        {renderTemplate()}
                                    </div>
                                </div>
                            </div>
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
    );
}
