import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Wand2, ChevronRight, ChevronLeft, Download, Plus, Trash2, Layout,
    User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Globe, Languages
} from 'lucide-react';
import html2canvas from 'html2canvas'; // Fixed import
import jsPDF from 'jspdf';

export default function ResumeBuilder() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('classic'); // Default to most ATS friendly
    const previewRef = useRef(null);

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
        if (!text) return alert("Please enter text to enhance.");
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5000/api/ai/enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ text, type })
            });
            const data = await res.json();

            const enhanced = data.enhancedText || text;

            if (field === 'experience' && id) updateItem('experience', id, 'description', enhanced);
            else if (field === 'projects' && id) updateItem('projects', id, 'description', enhanced);
            else if (field === 'summary') handleSimpleChange('summary', enhanced);
            else if (field === 'skills') handleSimpleChange('skills', enhanced);

        } catch (err) {
            console.error("AI Error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!previewRef.current) return;
        const canvas = await html2canvas(previewRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${resumeData.personal.fullName || 'resume'}.pdf`);
    };

    // --- Render Editors ---

    const renderEditor = () => {
        switch (activeStep) {
            case 0: // Header
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="section-title">Header Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <input type="text" placeholder="Full Name" className="input-field font-bold" value={resumeData.personal.fullName} onChange={(e) => handlePersonalChange('fullName', e.target.value)} />
                            <input type="text" placeholder="Target Job Title (e.g. Frontend Developer)" className="input-field" value={resumeData.personal.jobTitle} onChange={(e) => handlePersonalChange('jobTitle', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="email" placeholder="Email" className="input-field" value={resumeData.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} />
                                <input type="text" placeholder="Phone" className="input-field" value={resumeData.personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
                            </div>
                            <input type="text" placeholder="Location (City, Country)" className="input-field" value={resumeData.personal.location} onChange={(e) => handlePersonalChange('location', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="LinkedIn URL" className="input-field" value={resumeData.personal.linkedin} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} />
                                <input type="text" placeholder="GitHub / Portfolio URL" className="input-field" value={resumeData.personal.github} onChange={(e) => handlePersonalChange('github', e.target.value)} />
                            </div>
                        </div>
                    </div>
                );
            case 1: // Summary
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="section-title">Professional Summary</h3>
                            <button onClick={() => handleAIEnhance('summary', resumeData.summary, 'summary')} disabled={loading} className="ai-btn">
                                <Wand2 size={12} /> {loading ? "Enhancing..." : "AI Enhance"}
                            </button>
                        </div>
                        <textarea className="textarea-field h-40" placeholder="2-4 lines summarizing your expertise..." value={resumeData.summary} onChange={(e) => handleSimpleChange('summary', e.target.value)} />
                    </div>
                );
            case 2: // Experience
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="section-title">Work Experience</h3>
                        {resumeData.experience.map((exp, index) => (
                            <div key={exp.id} className="card-input">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-gray-300">Job #{index + 1}</h4>
                                    <button onClick={() => removeItem('experience', exp.id)} className="delete-btn"><Trash2 size={16} /></button>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input type="text" placeholder="Job Title" className="input-field" value={exp.title} onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)} />
                                    <input type="text" placeholder="Company" className="input-field" value={exp.company} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} />
                                    <input type="text" placeholder="Start Date" className="input-field" value={exp.startDate} onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)} />
                                    <input type="text" placeholder="End Date" className="input-field" value={exp.endDate} onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)} />
                                    <input type="text" placeholder="Location" className="input-field col-span-2" value={exp.location} onChange={(e) => updateItem('experience', exp.id, 'location', e.target.value)} />
                                </div>
                                <div className="relative">
                                    <textarea placeholder="Responsibilities (Bullet points)..." className="textarea-field h-32 mb-1" value={exp.description} onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)} />
                                    <button onClick={() => handleAIEnhance('experience', exp.description, 'experience', exp.id)} disabled={loading} className="ai-btn-sm absolute bottom-3 right-3">
                                        <Wand2 size={12} /> AI Rewrite
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button onClick={addExperience} className="add-btn"><Plus size={18} /> Add Experience</button>
                    </div>
                );
            case 3: // Projects
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="section-title">Projects</h3>
                        {resumeData.projects.map((proj, index) => (
                            <div key={proj.id} className="card-input">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-gray-300">Project #{index + 1}</h4>
                                    <button onClick={() => removeItem('projects', proj.id)} className="delete-btn"><Trash2 size={16} /></button>
                                </div>
                                <div className="grid grid-cols-1 gap-3 mb-3">
                                    <input type="text" placeholder="Project Name" className="input-field" value={proj.name} onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)} />
                                    <input type="text" placeholder="Tech Stack (e.g. React, Node.js)" className="input-field" value={proj.techStack} onChange={(e) => updateItem('projects', proj.id, 'techStack', e.target.value)} />
                                    <input type="text" placeholder="Link (GitHub/Live)" className="input-field" value={proj.link} onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)} />
                                </div>
                                <div className="relative">
                                    <textarea placeholder="Description..." className="textarea-field h-24 mb-1" value={proj.description} onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)} />
                                    <button onClick={() => handleAIEnhance('projects', proj.description, 'summary', proj.id)} disabled={loading} className="ai-btn-sm absolute bottom-3 right-3">
                                        <Wand2 size={12} /> AI Rewrite
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button onClick={addProject} className="add-btn"><Plus size={18} /> Add Project</button>
                    </div>
                );
            case 4: // Education
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="section-title">Education</h3>
                        {resumeData.education.map((edu, index) => (
                            <div key={edu.id} className="card-input">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-gray-300">Education #{index + 1}</h4>
                                    <button onClick={() => removeItem('education', edu.id)} className="delete-btn"><Trash2 size={16} /></button>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <input type="text" placeholder="Degree / Major" className="input-field" value={edu.degree} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} />
                                    <input type="text" placeholder="College / University" className="input-field" value={edu.school} onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="Year / Duration" className="input-field" value={edu.year} onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)} />
                                        <input type="text" placeholder="CGPA / Grade (Optional)" className="input-field" value={edu.grade} onChange={(e) => updateItem('education', edu.id, 'grade', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addEducation} className="add-btn"><Plus size={18} /> Add Education</button>
                    </div>
                );
            case 5: // Skills
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="section-title">Technical Skills</h3>
                            <button onClick={() => handleAIEnhance('skills', resumeData.skills, 'general')} disabled={loading} className="ai-btn">
                                <Wand2 size={12} /> {loading ? "Optimizing..." : "Format Skills"}
                            </button>
                        </div>
                        <textarea className="textarea-field h-40" placeholder="React, Node.js, Python, Java, SQL, Git..." value={resumeData.skills} onChange={(e) => handleSimpleChange('skills', e.target.value)} />
                        <p className="text-xs text-gray-400">ATS Tip: Use comma-separated values or clear categories.</p>
                    </div>
                );
            case 6: // Extras
                return (
                    <div className="space-y-6 animate-fade-in">
                        {/* Certifications */}
                        <div>
                            <h3 className="section-title mb-3">Certifications</h3>
                            {resumeData.certifications.map((cert) => (
                                <div key={cert.id} className="flex gap-2 mb-2">
                                    <input type="text" placeholder="Certificate Name" className="input-field flex-1" value={cert.name} onChange={(e) => updateItem('certifications', cert.id, 'name', e.target.value)} />
                                    <input type="text" placeholder="Platform/Year" className="input-field w-1/3" value={cert.year} onChange={(e) => updateItem('certifications', cert.id, 'year', e.target.value)} />
                                    <button onClick={() => removeItem('certifications', cert.id)} className="delete-text-btn"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button onClick={addCertification} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"><Plus size={14} /> Add Certificate</button>
                        </div>

                        {/* Achievements */}
                        <div>
                            <h3 className="section-title mb-3">Achievements</h3>
                            {resumeData.achievements.map((ach) => (
                                <div key={ach.id} className="flex gap-2 mb-2">
                                    <input type="text" placeholder="Achievement (e.g. Winner of Hackathon)" className="input-field flex-1" value={ach.title} onChange={(e) => updateItem('achievements', ach.id, 'title', e.target.value)} />
                                    <button onClick={() => removeItem('achievements', ach.id)} className="delete-text-btn"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button onClick={addAchievement} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"><Plus size={14} /> Add Achievement</button>
                        </div>
                    </div>
                );
            case 7: // Finish / Templates
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="section-title">Select Template</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'classic', name: 'Standard ATS', desc: 'Best for Parsers' },
                                { id: 'modern', name: 'Modern Clean', desc: 'Tech Friendly' },
                                { id: 'minimal', name: 'Minimalist', desc: 'Executive Style' }
                            ].map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTemplate === t.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/30'}`}
                                >
                                    <div className="h-20 bg-gray-700/50 rounded mb-2 flex items-center justify-center">
                                        <Layout size={24} className={selectedTemplate === t.id ? "text-emerald-400" : "text-gray-500"} />
                                    </div>
                                    <p className="text-center font-bold text-sm">{t.name}</p>
                                    <p className="text-center text-xs text-gray-400">{t.desc}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleDownloadPDF}
                            className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex justify-center items-center gap-2"
                        >
                            <Download size={20} /> Download PDF
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-inter">
            <style>{`
        .section-title { font-size: 1.25rem; font-weight: 600; color: #a855f7; margin-bottom: 1rem; }
        .input-field { width: 100%; bg: transparent; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.75rem; color: white; outline: none; transition: 0.2s; }
        .input-field:focus { border-color: #a855f7; background: rgba(255,255,255,0.08); }
        .textarea-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.75rem; color: white; outline: none; resize: none; transition: 0.2s; font-size: 0.9rem; line-height: 1.5; }
        .textarea-field:focus { border-color: #a855f7; }
        .card-input { padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 0.75rem; margin-bottom: 1rem; position: relative; }
        .ai-btn { background: linear-gradient(to right, #a855f7, #ec4899); border-radius: 99px; padding: 4px 12px; font-size: 12px; display: flex; align-items: center; gap: 6px; font-weight: 600; }
        .ai-btn-sm { background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 6px; padding: 4px 8px; font-size: 11px; display: flex; align-items: center; gap: 4px; color: #d8b4fe; }
        .add-btn { width: 100%; padding: 12px; border: 1px dashed #4b5563; border-radius: 8px; color: #9ca3af; display: flex; justify-content: center; align-items: center; gap: 8px; transition: 0.2s; }
        .add-btn:hover { border-color: #a855f7; color: #a855f7; background: rgba(168, 85, 247, 0.05); }
        .delete-btn { color: #ef4444; padding: 4px; border-radius: 4px; transition: 0.2s; }
        .delete-btn:hover { background: rgba(239, 68, 68, 0.1); }
        .delete-text-btn { color: #6b7280; padding: 4px; }
        .delete-text-btn:hover { color: #ef4444; }
        
        /* SCROLLBAR HIDE */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            {/* LEFT PANEL: WIZARD */}
            <div className="w-full md:w-[45%] lg:w-[40%] border-r border-white/10 flex flex-col h-screen bg-[#09090b]">
                <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-[#09090b] z-10">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-full transition"><ChevronLeft size={20} /></button>
                    <div>
                        <h1 className="text-xl font-bold">Resume Builder</h1>
                        <p className="text-xs text-gray-500">Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {renderEditor()}
                </div>

                <div className="p-4 border-t border-white/10 flex justify-between bg-[#09090b] z-10">
                    <button onClick={() => setActiveStep(p => Math.max(0, p - 1))} disabled={activeStep === 0} className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm disabled:opacity-30">Back</button>
                    <div className="flex gap-1 items-center">
                        {steps.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeStep ? 'bg-purple-500 scale-125' : 'bg-gray-800'}`} />)}
                    </div>
                    <button onClick={() => setActiveStep(p => Math.min(steps.length - 1, p + 1))} disabled={activeStep === steps.length - 1} className="px-6 py-2 rounded-lg bg-white text-black font-bold text-sm hover:bg-gray-200 disabled:opacity-50">Next</button>
                </div>
            </div>

            {/* RIGHT PANEL: LIVE PREVIEW */}
            <div className="hidden md:flex flex-1 bg-[#1c1c1e] items-start justify-center p-8 overflow-y-auto">
                <div
                    ref={previewRef}
                    className={`
                w-[210mm] bg-white text-black shadow-2xl origin-top scale-[0.6] lg:scale-[0.75] xl:scale-[0.85] transition-all duration-300
                pb-16
            `}
                    style={{
                        minHeight: '297mm',
                        padding: activeStep === 7 ? '0' : '20mm', // Remove padding adjustment if needed, usually fixed padding
                        fontFamily: selectedTemplate === 'modern' ? 'ui-sans-serif, system-ui, sans-serif' : selectedTemplate === 'classic' ? 'Times, Times New Roman, serif' : 'monospace'
                    }}
                >
                    {/* --- TEMPLATE RENDERER --- */}

                    {/* HEADER */}
                    <header className={`mb-6 ${selectedTemplate === 'classic' ? 'text-center' : 'border-b-2 border-gray-800 pb-4'}`}>
                        <h1 className="text-3xl font-extrabold uppercase tracking-wide text-gray-900 mb-1">{resumeData.personal.fullName || "YOUR NAME"}</h1>
                        <p className="text-lg text-gray-700 font-medium mb-2">{resumeData.personal.jobTitle || "Target Job Title"}</p>

                        <div className={`text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1 ${selectedTemplate === 'classic' ? 'justify-center' : ''}`}>
                            {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                            {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
                            {resumeData.personal.location && <span>• {resumeData.personal.location}</span>}
                            {resumeData.personal.linkedin && <span>• <a href="#" className="text-blue-600 underline">LinkedIn</a></span>}
                            {resumeData.personal.github && <span>• <a href="#" className="text-blue-600 underline">GitHub/Portfolio</a></span>}
                        </div>
                    </header>

                    {/* SUMMARY */}
                    {resumeData.summary && (
                        <section className="mb-5">
                            <h2 className={`text-sm font-bold uppercase tracking-wider mb-2 ${selectedTemplate === 'minimal' ? 'text-gray-500 border-b border-gray-200' : 'text-gray-900 border-b border-gray-400 pb-1'}`}>Professional Summary</h2>
                            <p className="text-sm text-gray-800 leading-relaxed text-justify">{resumeData.summary}</p>
                        </section>
                    )}

                    {/* SKILLS */}
                    {resumeData.skills && (
                        <section className="mb-5">
                            <h2 className={`text-sm font-bold uppercase tracking-wider mb-2 ${selectedTemplate === 'minimal' ? 'text-gray-500 border-b border-gray-200' : 'text-gray-900 border-b border-gray-400 pb-1'}`}>Skills</h2>
                            <p className="text-sm text-gray-800 leading-relaxed">{resumeData.skills}</p>
                        </section>
                    )}

                    {/* EXPERIENCE */}
                    {resumeData.experience.length > 0 && (
                        <section className="mb-5">
                            <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 ${selectedTemplate === 'minimal' ? 'text-gray-500 border-b border-gray-200' : 'text-gray-900 border-b border-gray-400 pb-1'}`}>Work Experience</h2>
                            {resumeData.experience.map(exp => (
                                <div key={exp.id} className="mb-4">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                                        <div className="text-sm text-gray-600 text-right">
                                            <span className="font-semibold block">{exp.company}</span>
                                            <span className="text-xs italic">{exp.startDate} – {exp.endDate} | {exp.location}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* PROJECTS */}
                    {resumeData.projects.length > 0 && (
                        <section className="mb-5">
                            <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 ${selectedTemplate === 'minimal' ? 'text-gray-500 border-b border-gray-200' : 'text-gray-900 border-b border-gray-400 pb-1'}`}>Projects</h2>
                            {resumeData.projects.map(proj => (
                                <div key={proj.id} className="mb-3">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-bold text-gray-900">{proj.name} <span className="text-xs font-normal text-gray-600">| {proj.techStack}</span></h3>
                                        {proj.link && <a href={proj.link} className="text-xs text-blue-600 underline">View Link</a>}
                                    </div>
                                    <p className="text-sm text-gray-800 mt-1">{proj.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* EDUCATION */}
                    {resumeData.education.length > 0 && (
                        <section className="mb-5">
                            <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 ${selectedTemplate === 'minimal' ? 'text-gray-500 border-b border-gray-200' : 'text-gray-900 border-b border-gray-400 pb-1'}`}>Education</h2>
                            {resumeData.education.map(edu => (
                                <div key={edu.id} className="mb-2 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                                        <div className="text-sm text-gray-700">{edu.school}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">{edu.year}</div>
                                        {edu.grade && <div className="text-xs text-gray-500">CGPA/Grade: {edu.grade}</div>}
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* CERTIFICATIONS & ACHIEVEMENTS */}
                    {(resumeData.certifications.length > 0 || resumeData.achievements.length > 0) && (
                        <section className="mb-5">
                            <h2 className={`text-sm font-bold uppercase tracking-wider mb-2 ${selectedTemplate === 'minimal' ? 'text-gray-500 border-b border-gray-200' : 'text-gray-900 border-b border-gray-400 pb-1'}`}>Additional Info</h2>

                            {resumeData.certifications.length > 0 && (
                                <div className="mb-3">
                                    <span className="font-bold text-sm text-gray-900 block mb-1">Certifications:</span>
                                    <ul className="list-disc list-inside text-sm text-gray-800">
                                        {resumeData.certifications.map(cert => (
                                            <li key={cert.id}>{cert.name} {cert.year ? `(${cert.year})` : ''}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {resumeData.achievements.length > 0 && (
                                <div>
                                    <span className="font-bold text-sm text-gray-900 block mb-1">Achievements:</span>
                                    <ul className="list-disc list-inside text-sm text-gray-800">
                                        {resumeData.achievements.map(ach => (
                                            <li key={ach.id}>{ach.title}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>
                    )}

                </div>
            </div>
        </div>
    );
}
