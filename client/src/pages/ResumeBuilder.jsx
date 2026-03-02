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
import Toast from '../components/ui/Toast';
import './ResumeBuilder.css';

export default function ResumeBuilder() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('classic'); // Default to most ATS friendly
    const previewRef = useRef(null);

    // Toast state
    const [toast, setToast] = useState(null); // { message, type }

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
        { title: "Summary", icon: <Sparkles size={18} />, key: "summary" },
        { title: "Experience", icon: <Briefcase size={18} />, key: "experience" },
        { title: "Projects", icon: <FolderGit2 size={18} />, key: "projects" },
        { title: "Education", icon: <GraduationCap size={18} />, key: "education" },
        { title: "Skills", icon: <Code2 size={18} />, key: "skills" },
        { title: "Extras", icon: <Award size={18} />, key: "extras" },
        { title: "Layout", icon: <Layout size={18} />, key: "template" }
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
            setToast({ message: "Please enter more text to enhance (at least 5 characters).", type: "info" });
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
                setToast({ message: "AI could not enhance this text. Please try again.", type: "error" });
            }

        } catch (err) {
            console.error("AI Enhancement Error:", err);
            setToast({ message: `Error: ${err.message}. Make sure the server is running.`, type: "error" });
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
        const previewElement = document.getElementById('resume-preview') || document.querySelector('[id^="resume-preview"]');
        if (!previewElement) {
            setToast({ message: "No content found to download. Please finish your resume.", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const container = previewElement.closest('.overflow-y-auto') || window;
            if (container.scrollTo) container.scrollTo({ top: 0, behavior: 'instant' });

            const canvas = await html2canvas(previewElement, {
                scale: 1.0,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('resume-preview') || clonedDoc.querySelector('[id^="resume-preview"]');
                    if (!el) return;

                    // FIX: html2canvas 1.4.1 crashes on Tailwind 4's color-mix() and oklch()
                    // We must convert all calculated colors to standard RGB strings for the capture
                    const allElements = el.querySelectorAll('*');
                    allElements.forEach(node => {
                        const style = window.getComputedStyle(node);

                        // Capture computed values to resolve color-mix and variables
                        const computedColor = style.color;
                        const computedBg = style.backgroundColor;
                        const computedBorderColor = style.borderColor;

                        // Force override with computed (resolved) values
                        if (computedColor) node.style.color = computedColor;
                        if (computedBg && computedBg !== 'rgba(0, 0, 0, 0)' && computedBg !== 'transparent') {
                            node.style.backgroundColor = computedBg;
                        }
                        if (computedBorderColor) node.style.borderColor = computedBorderColor;

                        // Disable transitions/animations which also cause issues
                        node.style.transition = 'none';
                        node.style.animation = 'none';
                    });

                    el.style.transform = 'none';
                    el.style.scale = '1';
                    el.style.margin = '0 auto';
                    el.style.padding = '0';
                    el.style.width = '210mm';
                    el.style.height = 'auto';
                    el.style.display = 'block';
                    el.style.visibility = 'visible';
                    el.style.position = 'relative';
                    el.style.boxShadow = 'none';
                    el.style.overflow = 'visible';

                    const styleTag = clonedDoc.createElement('style');
                    styleTag.innerHTML = `
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; transition: none !important; animation: none !important; }
                        body { background: white !important; overflow: visible !important; width: auto !important; height: auto !important; }
                        #resume-preview, [id^="resume-preview"] { 
                            background: white !important; 
                            color: black !important; 
                            min-height: 297mm !important;
                            overflow: visible !important;
                            box-shadow: none !important;
                        }
                    `;
                    clonedDoc.head.appendChild(styleTag);
                }
            });

            // Standard JPEG 0.7 quality is significantly smaller and usually acceptable for documents
            const imgData = canvas.toDataURL('image/jpeg', 0.7);

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

            const rawFileName = (resumeData.personal.fullName || 'Resume').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = rawFileName.length > 0 ? rawFileName : 'my_resume';
            pdf.save(`${fileName}_Professional.pdf`);

            setToast({ message: "Resume downloaded successfully!", type: "success" });
        } catch (err) {
            console.error("PDF Export Error:", err);
            setToast({
                message: "Download failed. Please try a simpler template or check your content length.",
                type: "error"
            });
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
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Contact <span className="text-primary">Details</span></h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Add your basic contact information</p>
                        </header>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input type="text" placeholder="e.g. Arjun Mehta" className="input-field text-base" value={resumeData.personal.fullName || ""} onChange={(e) => handlePersonalChange('fullName', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Job Title</label>
                                        <button onClick={() => handleAIEnhance('jobTitle', resumeData.personal.jobTitle, 'jobTitle')} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1"><Sparkles size={10} /> AI Improve</button>
                                    </div>
                                    <input type="text" placeholder="e.g. Full Stack Developer" className="input-field text-base" value={resumeData.personal.jobTitle || ""} onChange={(e) => handlePersonalChange('jobTitle', e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                                    <input type="email" placeholder="arjun.mehta@email.com" className="input-field text-base" value={resumeData.personal.email || ""} onChange={(e) => handlePersonalChange('email', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone</label>
                                    <input type="text" placeholder="+91 98765 43210" className="input-field text-base" value={resumeData.personal.phone || ""} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                                <input type="text" placeholder="Mumbai, Maharashtra" className="input-field text-base" value={resumeData.personal.location || ""} onChange={(e) => handlePersonalChange('location', e.target.value)} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">LinkedIn</label>
                                    <input type="text" placeholder="linkedin.com/in/arjun-mehta" className="input-field text-base" value={resumeData.personal.linkedin || ""} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">GitHub</label>
                                    <input type="text" placeholder="github.com/arjun-mehta" className="input-field text-base" value={resumeData.personal.github || ""} onChange={(e) => handlePersonalChange('github', e.target.value)} />
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">About <span className="text-primary">You</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Briefly explain your best skills</p>
                            </div>
                            <button onClick={() => handleAIEnhance('summary', resumeData.summary, 'summary')} disabled={loading} className="ai-btn py-2">
                                <Sparkles size={16} /> {loading ? "Improving..." : "AI Improve"}
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Work <span className="text-primary">Experience</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">List your past jobs and roles</p>
                            </div>
                            <button onClick={addExperience} className="ai-btn-sm py-2">
                                <Plus size={16} /> Add Job
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Title</label>
                                            <input type="text" placeholder="e.g. Lead Developer" className="input-field text-base" value={exp.title || ""} onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Company</label>
                                            <input type="text" placeholder="e.g. Tata Consultancy Services" className="input-field text-base" value={exp.company || ""} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Start Date</label>
                                            <input type="text" placeholder="Jan 2020" className="input-field text-base" value={exp.startDate || ""} onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">End Date</label>
                                            <input type="text" placeholder="Present" className="input-field text-base" value={exp.endDate || ""} onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Achievements & Impact</label>
                                            <button onClick={() => handleAIEnhance('experience', exp.description, 'experience', exp.id)} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1.5">
                                                <Sparkles size={12} /> AI Rewrite
                                            </button>
                                        </div>
                                        <textarea
                                            placeholder="• Scaled core platform to 1M+ active users..."
                                            className="textarea-field h-40 custom-scrollbar text-base"
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">My <span className="text-primary">Projects</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Show what you have built</p>
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Project Name</label>
                                            <input type="text" placeholder="e.g. AI Content Engine" className="input-field text-base" value={proj.name || ""} onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Tech Stack</label>
                                            <input type="text" placeholder="e.g. Next.js, OpenAI, PostgreSQL" className="input-field text-base" value={proj.techStack || ""} onChange={(e) => updateItem('projects', proj.id, 'techStack', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Outcome & Contribution</label>
                                            <button onClick={() => handleAIEnhance('projects', proj.description, 'projects', proj.id)} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1.5">
                                                <Sparkles size={12} /> AI Rewrite
                                            </button>
                                        </div>
                                        <textarea
                                            placeholder="Decreased processing time by 45% by implementing a custom caching layer..."
                                            className="textarea-field h-32 custom-scrollbar text-base"
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Education <span className="text-primary">History</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Where you went to school</p>
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

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Degree</label>
                                            <input type="text" placeholder="e.g. Computer Science" className="input-field text-base" value={edu.degree || ""} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">School</label>
                                            <input type="text" placeholder="e.g. Indian Institute of Technology" className="input-field text-base" value={edu.school || ""} onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Year</label>
                                                <input type="text" placeholder="e.g. 2022" className="input-field text-base" value={edu.year || ""} onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">GPA</label>
                                                <input type="text" placeholder="e.g. 3.9" className="input-field text-base" value={edu.grade || ""} onChange={(e) => updateItem('education', edu.id, 'grade', e.target.value)} />
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
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">My <span className="text-primary">Skills</span></h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">List your top skills</p>
                            </div>
                            <button onClick={() => handleAIEnhance('skills', resumeData.skills, 'skills')} disabled={loading} className="ai-btn py-2">
                                <Sparkles size={16} /> {loading ? "Optimizing..." : "Analyze for ATS"}
                            </button>
                        </header>

                        <div className="space-y-6">
                            <textarea
                                className="textarea-field h-64 custom-scrollbar font-mono text-base leading-relaxed p-6"
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
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Extra <span className="text-primary">Info</span></h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Certifications and achievements</p>
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
                                    <div key={cert.id} className="card-input group flex items-end gap-6 mb-4">
                                        <div className="flex-1 space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Certificate Name</label>
                                            <input type="text" placeholder="e.g. AWS Solutions Architect" className="input-field text-base" value={cert.name || ""} onChange={(e) => updateItem('certifications', cert.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="w-1/3 space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Year</label>
                                            <input type="text" placeholder="2023" className="input-field text-base" value={cert.year || ""} onChange={(e) => updateItem('certifications', cert.id, 'year', e.target.value)} />
                                        </div>
                                        <button onClick={() => removeItem('certifications', cert.id)} className="delete-btn static mb-1 mt-0">
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
                                    <div key={ach.id} className="card-input group flex items-center gap-6 mb-4">
                                        <div className="flex-1 space-y-3">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Achievement</label>
                                            <input type="text" placeholder="e.g. Increased revenue by 25% through A/B testing..." className="input-field text-base" value={ach.title || ""} onChange={(e) => updateItem('achievements', ach.id, 'title', e.target.value)} />
                                        </div>
                                        <button onClick={() => removeItem('achievements', ach.id)} className="delete-btn static mt-6">
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
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Choose <span className="text-primary">Layout</span></h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60">Select a design for your resume</p>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { id: 'classic', name: 'ATS Optimized', desc: 'Maximum Parsing Accuracy', icon: Layout },
                                { id: 'modern', name: 'Modern Premium', desc: 'Sleek & Professional', icon: Layout },
                                { id: 'minimal', name: 'Minimalist', desc: 'Clean & Simple', icon: Layout }
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
            <header className={`border-b-2 pb-8 text-center ${theme === 'dark' ? 'border-primary/30' : 'border-slate-900/10'}`}>
                <h1 className={`text-5xl font-black uppercase tracking-tighter mb-4 leading-none ${theme === 'dark' ? 'text-foreground' : 'text-slate-900'}`}>{personal.fullName || 'YOUR NAME'}</h1>
                <div className={`flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] font-bold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-muted-foreground' : 'text-slate-500'}`}>
                    {personal.jobTitle && <span className="text-primary font-black">{personal.jobTitle}</span>}
                    {personal.email && <span className="flex items-center gap-1">{personal.email}</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>{personal.location}</span>}
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-3 text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {personal.linkedin && <span>LinkedIn: {personal.linkedin.replace(/https?:\/\//, '')}</span>}
                    {personal.github && <span>GitHub: {personal.github.replace(/https?:\/\//, '')}</span>}
                </div>
            </header>
        );

        const Section = ({ title, children }) => (
            <section className="space-y-4">
                <h2 className="text-[12px] font-black uppercase tracking-[0.3em] border-l-4 border-primary pl-4 mb-4">{title}</h2>
                <div className="space-y-6">{children}</div>
            </section>
        );

        if (selectedTemplate === 'modern') {
            return (
                <div className={`flex transition-colors duration-500 w-[210mm] min-h-[297mm] h-full ${theme === 'dark' ? 'text-foreground bg-[#09090b]' : 'text-slate-900 bg-white'}`}>
                    {/* Sidebar */}
                    <div className={`w-[32%] p-10 space-y-10 h-full ${theme === 'dark' ? 'bg-zinc-900/50 border-r border-white/5' : 'bg-slate-50 border-r border-slate-200'}`}>
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">{personal.fullName || 'NAME'}</h1>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">{personal.jobTitle}</p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">Contact</h3>
                            <div className="space-y-3 text-[11px] font-bold uppercase tracking-tight">
                                <p className="break-all opacity-80">{personal.email}</p>
                                <p className="opacity-80">{personal.phone}</p>
                                <p className="break-words opacity-80">{personal.location}</p>
                                {personal.linkedin && <p className="break-all lowercase text-[10px] text-primary">{personal.linkedin.replace(/https?:\/\/(www\.)?/, '')}</p>}
                                {personal.github && <p className="break-all lowercase text-[10px] text-primary">{personal.github.replace(/https?:\/\/(www\.)?/, '')}</p>}
                            </div>
                        </div>

                        {skills && (
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.split(/[,\n•]/).filter(s => s.trim()).map((s, i) => (
                                        <span key={i} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'bg-white/5 text-white/80' : 'bg-slate-200 text-slate-800'}`}>
                                            {s.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {education.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">Education</h3>
                                {education.map(edu => (
                                    <div key={edu.id} className="space-y-1.5">
                                        <p className="text-[13px] font-black uppercase leading-tight">{edu.degree}</p>
                                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-wide">{edu.school}</p>
                                        <p className="text-[10px] font-black text-primary uppercase">{edu.year} {edu.grade && `· ${edu.grade}`}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-12 space-y-10 h-full">
                        {summary && (
                            <div className="space-y-4 border-b border-border/10 pb-8">
                                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Executive Summary</h3>
                                <p className="text-[14px] leading-relaxed opacity-80 font-medium italic">{summary}</p>
                            </div>
                        )}

                        {experience.length > 0 && (
                            <div className="space-y-8">
                                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Experience</h3>
                                <div className="space-y-10">
                                    {experience.map(exp => (
                                        <div key={exp.id} className="space-y-3">
                                            <div className="flex justify-between items-baseline gap-4">
                                                <h4 className="font-black uppercase text-[15px] tracking-tight flex-1">{exp.title}</h4>
                                                <span className="text-[11px] font-black opacity-40 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                                            </div>
                                            <p className="text-[12px] font-black text-primary uppercase tracking-widest">{exp.company}</p>
                                            <p className="text-[14px] leading-relaxed opacity-70">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {projects.length > 0 && (
                            <div className="space-y-8">
                                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Selected Projects</h3>
                                <div className="space-y-10">
                                    {projects.map(proj => (
                                        <div key={proj.id} className="space-y-3">
                                            <div className="flex justify-between items-baseline gap-4">
                                                <h4 className="font-black uppercase text-[15px] tracking-tight flex-1">{proj.name}</h4>
                                                <span className="text-[11px] font-bold text-primary uppercase tracking-widest">{proj.techStack}</span>
                                            </div>
                                            <p className="text-[14px] leading-relaxed opacity-70">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(certifications.length > 0 || achievements.length > 0) && (
                            <div className="space-y-6">
                                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Achievements</h3>
                                <div className="space-y-2 text-[13px] font-medium opacity-70 italic leading-relaxed">
                                    {certifications.map(c => <p key={c.id}>• {c.name} ({c.year})</p>)}
                                    {achievements.map(a => <p key={a.id}>• {a.title}</p>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (selectedTemplate === 'minimal') {
            return (
                <div className={`p-[25mm] space-y-12 font-serif w-full h-full text-center transition-colors duration-500 overflow-y-auto custom-scrollbar ${theme === 'dark' ? 'text-foreground bg-[#09090b]' : 'text-slate-800 bg-white'}`}>
                    <header className="space-y-6">
                        <h1 className="text-5xl font-light tracking-[0.25em] uppercase border-b-2 border-border/10 pb-6 mb-4">{personal.fullName || 'YOUR NAME'}</h1>
                        <div className="flex justify-center flex-wrap gap-x-10 gap-y-3 text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">
                            <span>{personal.location}</span>
                            <span className="text-primary">•</span>
                            <span>{personal.email}</span>
                            <span className="text-primary">•</span>
                            <span>{personal.phone}</span>
                            {personal.linkedin && (
                                <>
                                    <span className="text-primary">•</span>
                                    <span>{personal.linkedin.replace(/https?:\/\//, '')}</span>
                                </>
                            )}
                        </div>
                    </header>
                    <div className="max-w-3xl mx-auto space-y-12 text-left pb-12">
                        {summary && (
                            <div className="space-y-4 border-y border-border/10 py-8 text-center italic">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-2">Introduction</h3>
                                <p className="text-[13px] leading-relaxed opacity-80 max-w-xl mx-auto">{summary}</p>
                            </div>
                        )}

                        {experience.length > 0 && (
                            <div className="space-y-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary border-b border-primary/20 pb-2">Experience History</h3>
                                <div className="space-y-10">
                                    {experience.map(exp => (
                                        <div key={exp.id} className="space-y-2.5">
                                            <div className="flex justify-between items-baseline gap-4">
                                                <h4 className="font-bold text-[14px] uppercase tracking-[0.1em] flex-1">{exp.title} <span className="text-primary/60 mx-2 font-light">/</span> {exp.company}</h4>
                                                <span className="text-[10px] font-medium uppercase tracking-widest opacity-60 shrink-0 text-right">{exp.startDate} — {exp.endDate}</span>
                                            </div>
                                            <p className="text-[13px] leading-relaxed opacity-80 whitespace-pre-line border-l border-border/20 pl-6 italic">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {projects.length > 0 && (
                            <div className="space-y-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary border-b border-primary/20 pb-2">Selected Works</h3>
                                <div className="space-y-8">
                                    {projects.map(proj => (
                                        <div key={proj.id} className="space-y-2">
                                            <div className="flex justify-between items-baseline gap-4">
                                                <h4 className="font-bold text-[13px] uppercase tracking-[0.1em] flex-1">{proj.name}</h4>
                                                <span className="text-[10px] uppercase font-medium tracking-widest text-primary/70 shrink-0 text-right">{proj.techStack}</span>
                                            </div>
                                            <p className="text-[12px] leading-relaxed opacity-70 italic whitespace-pre-line pl-6">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-16 pt-10 border-t border-border/10">
                            {education.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Scholastic</h3>
                                    {education.map(edu => (
                                        <div key={edu.id} className="space-y-1.5">
                                            <p className="text-[13px] font-bold uppercase tracking-tight">{edu.degree}</p>
                                            <p className="text-[10px] opacity-60 uppercase tracking-widest">{edu.school} <br /> {edu.year} · {edu.grade}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Core Expertise</h3>
                                <div className="space-y-4">
                                    <p className="text-[11px] leading-relaxed uppercase tracking-[0.2em] opacity-80 font-medium">{skills}</p>
                                    <div className="space-y-1.5 opacity-60 italic text-[10px] border-t border-border/5 pt-4">
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
            <div className={`flex flex-col space-y-10 font-sans leading-relaxed transition-colors duration-500 w-[210mm] min-h-[297mm] ${theme === 'dark' ? 'text-foreground bg-[#09090b]' : 'text-slate-800 bg-white'}`} style={{ padding: '20mm' }}>
                <LayoutHeader />
                {summary && (
                    <Section title="Professional Summary">
                        <p className="text-[14px] italic leading-relaxed opacity-80 font-medium">{summary}</p>
                    </Section>
                )}

                <div className="space-y-12 pb-12">
                    <Section title="Work Experience">
                        <div className="space-y-10">
                            {experience.map(exp => (
                                <div key={exp.id} className="space-y-3">
                                    <div className="flex justify-between items-baseline gap-4">
                                        <h3 className="text-[16px] font-black uppercase tracking-tight flex-1">{exp.title}</h3>
                                        <span className="text-[11px] font-black opacity-40 uppercase tracking-widest shrink-0 text-right">{exp.startDate} — {exp.endDate}</span>
                                    </div>
                                    <p className="text-[13px] font-black text-primary uppercase tracking-[0.1em] italic leading-none">{exp.company} | {exp.location}</p>
                                    <p className="text-[14px] leading-relaxed opacity-80 whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {projects.length > 0 && (
                        <Section title="Key Projects">
                            <div className="space-y-10">
                                {projects.map(proj => (
                                    <div key={proj.id} className="space-y-3">
                                        <div className="flex justify-between items-baseline gap-4">
                                            <h4 className="font-black text-[15px] uppercase tracking-wider flex-1">{proj.name}</h4>
                                            <span className="text-[11px] font-bold text-primary uppercase tracking-widest opacity-80 shrink-0 text-right">{proj.techStack}</span>
                                        </div>
                                        <p className="text-[14px] leading-relaxed opacity-80 whitespace-pre-line">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    <div className="grid grid-cols-2 gap-12">
                        {education.length > 0 && (
                            <Section title="Education">
                                <div className="space-y-6">
                                    {education.map(edu => (
                                        <div key={edu.id} className="space-y-2">
                                            <h4 className="text-[14px] font-black uppercase leading-tight">{edu.degree}</h4>
                                            <p className="text-[12px] font-bold opacity-60 uppercase tracking-wide">{edu.school}</p>
                                            <p className="text-[12px] font-black text-primary uppercase tracking-[0.2em]">{edu.year} · {edu.grade}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {skills && (
                            <Section title="Expertise">
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {skills.split(/[,\n•]/).filter(s => s.trim()).map((s, i) => (
                                        <span key={i} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-white/70' : 'bg-slate-100 text-slate-700'} border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                                            {s.trim()}
                                        </span>
                                    ))}
                                </div>
                            </Section>
                        )}
                    </div>

                    {(certifications.length > 0 || achievements.length > 0) && (
                        <Section title="Achievements & Certs">
                            <div className="grid grid-cols-2 gap-8 text-[12px] font-bold opacity-80 uppercase tracking-tight leading-relaxed italic">
                                <div className="space-y-3">
                                    {certifications.map(c => <p key={c.id} className="flex items-start gap-2"><span className="text-primary">•</span>{c.name}</p>)}
                                </div>
                                <div className="space-y-3">
                                    {achievements.map(a => <p key={a.id} className="flex items-start gap-2"><span className="text-primary">•</span>{a.title}</p>)}
                                </div>
                            </div>
                        </Section>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-300 overflow-x-hidden">
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
                <div className="flex-[1.5] flex flex-col relative z-10 bg-transparent overflow-hidden border-r border-border/50">

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
                                    <div className="p-1 w-fit rounded-full bg-secondary/30 border border-border/50 mb-10 flex items-center gap-3 pr-5 backdrop-blur-md">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-black shadow-lg shadow-primary/20">
                                            {activeStep + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary leading-none mb-0.5">Step</span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none">{steps[activeStep].title}</span>
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
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Exit
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
                                Back
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
                                    <span className="relative z-10">{activeStep === steps.length - 2 ? 'Finish' : 'Next'}</span>
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
                                    <span>{loading ? 'Working...' : 'Download Resume'}</span>
                                </button>
                            )}
                        </div>
                    </footer>
                </div>

                {/* RIGHT PANEL: FULL-HEIGHT PREVIEW */}
                <div className="flex-1 min-w-[550px] bg-secondary/20 hidden lg:flex flex-col relative z-20 overflow-hidden border-l border-border/50 backdrop-blur-sm">
                    {/* PANEL HEADER */}
                    <div className="h-16 border-b border-border/50 flex items-center justify-between px-8 bg-card/40 backdrop-blur-xl shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60">Live Preview</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">
                                {selectedTemplate === 'modern' ? 'Modern Premium' : selectedTemplate === 'minimal' ? 'Minimalist' : 'ATS Optimized'}
                            </div>
                        </div>
                    </div>

                    {/* PREVIEW CONTAINER */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex items-start justify-center relative p-12 bg-zinc-950/5">
                        {/* AMBIENT GLOW BEHIND SHEET */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                        <div className="a4-sheet-container">
                            <div className="relative group">
                                {/* REALISTIC PAPER DEPTH SHADOWS */}
                                <div className="absolute -inset-4 bg-black/20 blur-2xl rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="a4-sheet relative z-10 shadow-2xl" style={{ backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff' }}>
                                    {/* PHYSICAL PAPER GRAIN */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

                                    <div id="resume-preview" className="w-full h-full bg-transparent">
                                        {renderTemplate()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

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
