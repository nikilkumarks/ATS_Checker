import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Wand2, ChevronRight, ChevronLeft, Download, Plus, Trash2, Layout,
    User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Globe, Languages,
    Mail, Phone, MapPin, Linkedin
} from 'lucide-react';
import html2canvas from 'html2canvas'; // Fixed import
import jsPDF from 'jspdf';

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
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                windowWidth: 794,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('resume-preview');
                    if (!el) return;

                    // Absolute stability for capture
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
                            background: white !important;
                            transform: none !important; 
                            scale: 1 !important; 
                            position: relative !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            display: block !important;
                            box-shadow: none !important;
                        }
                        /* Modern Double Column specific fixes */
                        #resume-preview aside { 
                            width: 260px !important;
                            min-height: 1123px !important;
                            flex-shrink: 0 !important;
                        }
                        #resume-preview main { 
                            width: 534px !important;
                            min-height: 1123px !important;
                            flex-shrink: 0 !important;
                        }
                        /* Ensure text colors are forced */
                        .text-white { color: #ffffff !important; }
                        .text-black { color: #000000 !important; }
                    `;
                    clonedDoc.head.appendChild(style);

                    // Force remove problematic styles
                    Array.from(clonedDoc.styleSheets).forEach(sheet => {
                        try {
                            const rules = Array.from(sheet.cssRules);
                            for (let i = rules.length - 1; i >= 0; i--) {
                                if (rules[i].cssText.includes('oklch')) sheet.deleteRule(i);
                            }
                        } catch (e) { }
                    });
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
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
            alert("Export failed. If using complex layouts, try the 'Standard ATS' template.");
        } finally {
            setLoading(false);
        }
    };



    // --- Render Editors ---

    const renderEditor = () => {
        switch (activeStep) {
            case 0: // Header
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="section-title">Header Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <input type="text" placeholder="Full Name" className="input-field font-bold" value={resumeData.personal.fullName || ""} onChange={(e) => handlePersonalChange('fullName', e.target.value)} />
                            <div className="relative">
                                <input type="text" placeholder="Target Job Title (e.g. Frontend Developer)" className="input-field pr-24" value={resumeData.personal.jobTitle || ""} onChange={(e) => handlePersonalChange('jobTitle', e.target.value)} />
                                <button
                                    onClick={() => handleAIEnhance('jobTitle', resumeData.personal.jobTitle, 'general')}
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 ai-btn-sm"
                                >
                                    <Wand2 size={10} /> Optimize
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="email" placeholder="Email" className="input-field" value={resumeData.personal.email || ""} onChange={(e) => handlePersonalChange('email', e.target.value)} />
                                <input type="text" placeholder="Phone" className="input-field" value={resumeData.personal.phone || ""} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
                            </div>
                            <input type="text" placeholder="Location (City, Country)" className="input-field" value={resumeData.personal.location || ""} onChange={(e) => handlePersonalChange('location', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="LinkedIn URL" className="input-field" value={resumeData.personal.linkedin || ""} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} />
                                <input type="text" placeholder="GitHub / Portfolio URL" className="input-field" value={resumeData.personal.github || ""} onChange={(e) => handlePersonalChange('github', e.target.value)} />
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
                                    <input type="text" placeholder="Job Title" className="input-field" value={exp.title || ""} onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)} />
                                    <input type="text" placeholder="Company" className="input-field" value={exp.company || ""} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} />
                                    <input type="text" placeholder="Start Date" className="input-field" value={exp.startDate || ""} onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)} />
                                    <input type="text" placeholder="End Date" className="input-field" value={exp.endDate || ""} onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)} />
                                    <input type="text" placeholder="Location" className="input-field col-span-2" value={exp.location || ""} onChange={(e) => updateItem('experience', exp.id, 'location', e.target.value)} />
                                </div>
                                <div className="relative">
                                    <textarea placeholder="Responsibilities (Bullet points)..." className="textarea-field h-32 mb-1" value={exp.description || ""} onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)} />
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
                                    <input type="text" placeholder="Project Name" className="input-field" value={proj.name || ""} onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)} />
                                    <input type="text" placeholder="Tech Stack (e.g. React, Node.js)" className="input-field" value={proj.techStack || ""} onChange={(e) => updateItem('projects', proj.id, 'techStack', e.target.value)} />
                                    <input type="text" placeholder="Link (GitHub/Live)" className="input-field" value={proj.link || ""} onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)} />
                                </div>
                                <div className="relative">
                                    <textarea placeholder="Description..." className="textarea-field h-24 mb-1" value={proj.description || ""} onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)} />
                                    <button onClick={() => handleAIEnhance('projects', proj.description, 'projects', proj.id)} disabled={loading} className="ai-btn-sm absolute bottom-3 right-3">
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
                                    <input type="text" placeholder="Degree / Major" className="input-field" value={edu.degree || ""} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} />
                                    <input type="text" placeholder="College / University" className="input-field" value={edu.school || ""} onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="Year / Duration" className="input-field" value={edu.year || ""} onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)} />
                                        <input type="text" placeholder="CGPA / Grade (Optional)" className="input-field" value={edu.grade || ""} onChange={(e) => updateItem('education', edu.id, 'grade', e.target.value)} />
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
                            <button onClick={() => handleAIEnhance('skills', resumeData.skills, 'skills')} disabled={loading} className="ai-btn">
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
                                    <input type="text" placeholder="Certificate Name" className="input-field flex-1" value={cert.name || ""} onChange={(e) => updateItem('certifications', cert.id, 'name', e.target.value)} />
                                    <input type="text" placeholder="Platform/Year" className="input-field w-1/3" value={cert.year || ""} onChange={(e) => updateItem('certifications', cert.id, 'year', e.target.value)} />
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
                                    <input type="text" placeholder="Achievement (e.g. Winner of Hackathon)" className="input-field flex-1" value={ach.title || ""} onChange={(e) => updateItem('achievements', ach.id, 'title', e.target.value)} />
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
                            disabled={loading}
                            className={`w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <Download size={20} /> Download PDF
                                </>
                            )}
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
            <div className={`
                ${activeStep === 7 ? 'fixed inset-0 z-[60] bg-[#1c1c1e] overflow-y-auto p-4 flex flex-col items-center' : 'hidden'} 
                md:static md:flex md:flex-1 md:bg-[#1c1c1e] md:items-start md:justify-center md:p-8 md:overflow-y-auto
            `}>
                {/* Mobile Close Button (only visible on step 7 mobile) */}
                {activeStep === 7 && (
                    <button
                        onClick={() => setActiveStep(6)}
                        className="md:hidden absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white z-[70]"
                    >
                        <Trash2 size={24} className="rotate-45" /> {/* Close icon alternative */}
                    </button>
                )}
                <div
                    ref={previewRef}
                    id="resume-preview"
                    key={selectedTemplate}
                    className={`
                w-[794px] bg-white text-black shadow-2xl origin-top scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.75] xl:scale-[0.85] transition-all duration-300
                pb-16
            `}
                    style={{
                        minHeight: '1123px',
                        fontFamily: selectedTemplate === 'modern' ? 'ui-sans-serif, system-ui, sans-serif' : selectedTemplate === 'classic' ? 'Times, Times New Roman, serif' : 'monospace'
                    }}
                >
                    {/* --- TEMPLATE RENDERER --- */}

                    {(() => {
                        const styles = {
                            classic: {
                                layout: "single",
                                container: "font-serif text-[#111827] bg-[#ffffff] w-[794px] min-h-[1123px] overflow-hidden",
                                header: "text-center mb-8 border-b-2 border-[#111827] pb-6",
                                name: "text-4xl font-bold uppercase tracking-widest mb-2 text-[#111827]",
                                title: "text-xl italic text-[#374151] mb-3",
                                meta: "flex justify-center flex-wrap text-sm text-[#4b5563] gap-4 italic",
                                sectionTitle: "text-lg font-bold uppercase tracking-widest border-b border-[#d1d5db] mb-4 pb-1 mt-6 text-[#111827]",
                                body: "text-sm leading-relaxed text-justify text-[#374151]",
                                subTitle: "font-bold text-[#111827]",
                                metaInfo: "italic text-[#4b5563] text-sm",
                                date: "text-[#4b5563] font-serif italic"
                            },
                            modern: {
                                layout: "double",
                                container: "font-sans text-[#0f172a] bg-[#ffffff] flex flex-row flex-nowrap w-[794px] min-h-[1123px]",
                                sidebar: "w-[260px] flex-shrink-0 bg-[#0f172a] text-[#ffffff] p-8",
                                main: "w-[534px] flex-shrink-0 p-10 bg-[#ffffff]",
                                header: "mb-10",
                                name: "text-4xl font-black tracking-tighter mb-1 text-[#ffffff]",
                                title: "text-lg text-[#818cf8] font-bold uppercase tracking-widest mb-6",
                                meta: "flex-col gap-3 text-[12px] font-medium text-[#cbd5e1]",
                                sectionTitle: "text-lg font-black text-[#0f172a] mb-6 pb-2 border-b-4 border-[#4f46e5] inline-block",
                                sidebarTitle: "text-xs font-bold uppercase tracking-[0.2em] text-[#a5b4fc] mb-4",
                                body: "text-[13px] leading-relaxed text-[#475569] font-medium",
                                subTitle: "font-black text-[#0f172a] text-base flex justify-between items-center",
                                metaInfo: "text-[#4f46e5] font-bold text-xs uppercase tracking-wide mt-0.5",
                                date: "text-[#94a3b8] font-bold text-[10px] uppercase"
                            },
                            minimal: {
                                layout: "single",
                                container: "font-mono text-[#1f2937] bg-[#ffffff] p-16 w-[794px] min-h-[1123px]",
                                header: "mb-10 text-left",
                                name: "text-3xl font-medium tracking-tighter text-[#000000] mb-4",
                                title: "text-sm uppercase tracking-widest text-[#6b7280] mb-6",
                                meta: "flex-col text-xs text-[#9ca3af] gap-1 items-start",
                                sectionTitle: "text-xs font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-6 mt-8",
                                body: "text-xs leading-loose text-[#4b5563]",
                                subTitle: "font-bold text-[#000000] text-sm",
                                metaInfo: "text-[#6b7280] text-xs",
                                date: "text-[#9ca3af] text-xs"
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

                                        <section className="mb-8">
                                            <h3 className={t.sidebarTitle}>Contact</h3>
                                            <div className={`flex ${t.meta}`}>
                                                {resumeData.personal.email && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-[#334155] flex items-center justify-center"><Mail size={10} color="#ffffff" /></div>
                                                        <span className="text-[#ffffff]">{resumeData.personal.email}</span>
                                                    </div>
                                                )}
                                                {resumeData.personal.phone && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-[#334155] flex items-center justify-center"><Phone size={10} color="#ffffff" /></div>
                                                        <span className="text-[#ffffff]">{resumeData.personal.phone}</span>
                                                    </div>
                                                )}
                                                {resumeData.personal.location && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-[#334155] flex items-center justify-center"><MapPin size={10} color="#ffffff" /></div>
                                                        <span className="text-[#ffffff]">{resumeData.personal.location}</span>
                                                    </div>
                                                )}
                                                {resumeData.personal.linkedin && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-[#334155] flex items-center justify-center"><Linkedin size={10} color="#ffffff" /></div>
                                                        <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#818cf8] hover:underline overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">LinkedIn</a>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {resumeData.skills && (
                                            <section className="mb-8">
                                                <h3 className={t.sidebarTitle}>Skills</h3>
                                                <p className="text-[12px] leading-6 text-[#cbd5e1] uppercase tracking-wider whitespace-pre-line">{resumeData.skills}</p>
                                            </section>
                                        )}

                                        {resumeData.education.length > 0 && (
                                            <section className="mb-8">
                                                <h3 className={t.sidebarTitle}>Education</h3>
                                                {resumeData.education.map(edu => (
                                                    <div key={edu.id} className="mb-4 text-[#ffffff]">
                                                        <div className="text-[13px] font-bold">{edu.degree}</div>
                                                        <div className="text-[11px] text-[#94a3b8] italic mb-1">{edu.school}</div>
                                                        <div className="text-[10px] text-[#818cf8]">{edu.year}</div>
                                                    </div>
                                                ))}
                                            </section>
                                        )}
                                    </aside>

                                    {/* MAIN CONTENT */}
                                    <main className={t.main}>
                                        {/* SUMMARY */}
                                        {resumeData.summary && (
                                            <section className="mb-10">
                                                <h2 className={t.sectionTitle}>Profile</h2>
                                                <p className={`${t.body} whitespace-pre-line`}>{resumeData.summary}</p>
                                            </section>
                                        )}

                                        {/* EXPERIENCE */}
                                        {resumeData.experience.length > 0 && (
                                            <section className="mb-10">
                                                <h2 className={t.sectionTitle}>Experience</h2>
                                                {resumeData.experience.map(exp => (
                                                    <div key={exp.id} className="mb-6 last:mb-0 text-[#0f172a]">
                                                        <div className={t.subTitle}>
                                                            <span className="text-[#0f172a]">{exp.title}</span>
                                                            <span className={t.date}>{exp.startDate} – {exp.endDate}</span>
                                                        </div>
                                                        <div className={t.metaInfo}>{exp.company} | {exp.location}</div>
                                                        <p className={`${t.body} mt-2 whitespace-pre-line text-[#475569]`}>{exp.description}</p>
                                                    </div>
                                                ))}
                                            </section>
                                        )}

                                        {/* PROJECTS */}
                                        {resumeData.projects.length > 0 && (
                                            <section className="mb-10">
                                                <h2 className={t.sectionTitle}>Projects</h2>
                                                {resumeData.projects.map(proj => (
                                                    <div key={proj.id} className="mb-5 last:mb-0">
                                                        <div className={t.subTitle}>
                                                            <span>{proj.name}</span>
                                                            {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 font-bold uppercase underline">Link</a>}
                                                        </div>
                                                        <div className="text-[11px] font-bold text-[#64748b] mb-1">{proj.techStack}</div>
                                                        <p className={t.body} style={{ color: '#475569' }}>{proj.description}</p>
                                                    </div>
                                                ))}
                                            </section>
                                        )}
                                    </main>
                                </div>
                            );
                        }

                        // SINGLE COLUMN LAYOUT (Classic / Minimal)
                        return (
                            <div className={t.container} style={{ padding: '20mm', boxSizing: 'border-box' }}>
                                {/* HEADER */}
                                <header className={t.header}>
                                    <h1 className={t.name}>{resumeData.personal.fullName || "YOUR NAME"}</h1>
                                    <p className={t.title}>{resumeData.personal.jobTitle || "Target Job Title"}</p>

                                    <div className={`flex flex-wrap ${t.meta}`}>
                                        {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                                        {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                                        {resumeData.personal.location && <span>{resumeData.personal.location}</span>}
                                        {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>}
                                        {resumeData.personal.github && <a href={resumeData.personal.github} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>}
                                    </div>
                                </header>

                                {/* SUMMARY */}
                                {resumeData.summary && (
                                    <section className="mb-6">
                                        <h2 className={t.sectionTitle}>Professional Summary</h2>
                                        <p className={`${t.body} whitespace-pre-line`}>{resumeData.summary}</p>
                                    </section>
                                )}

                                {/* SKILLS */}
                                {resumeData.skills && (
                                    <section className="mb-6">
                                        <h2 className={t.sectionTitle}>Technical Skills</h2>
                                        <p className={`${t.body} whitespace-pre-line`}>{resumeData.skills}</p>
                                    </section>
                                )}

                                {/* EXPERIENCE */}
                                {resumeData.experience.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className={t.sectionTitle}>Experience</h2>
                                        {resumeData.experience.map(exp => (
                                            <div key={exp.id} className="mb-5 last:mb-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className={t.subTitle}>{exp.title}</h3>
                                                        <div className={t.metaInfo}>{exp.company} | {exp.location}</div>
                                                    </div>
                                                    <span className={t.date}>{exp.startDate} – {exp.endDate}</span>
                                                </div>
                                                <p className={`${t.body} whitespace-pre-line`}>{exp.description}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* PROJECTS */}
                                {resumeData.projects.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className={t.sectionTitle}>Projects</h2>
                                        {resumeData.projects.map(proj => (
                                            <div key={proj.id} className="mb-4 last:mb-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className={t.subTitle}>
                                                        {proj.name}
                                                        {proj.techStack && <span className={`font-normal text-xs ml-2 opacity-75`}>({proj.techStack})</span>}
                                                    </h3>
                                                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#2563eb] hover:underline">View Project</a>}
                                                </div>
                                                <p className={t.body}>{proj.description}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* EDUCATION */}
                                {resumeData.education.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className={t.sectionTitle}>Education</h2>
                                        {resumeData.education.map(edu => (
                                            <div key={edu.id} className="mb-3 flex justify-between items-start">
                                                <div>
                                                    <h3 className={t.subTitle}>{edu.degree}</h3>
                                                    <div className="text-sm text-[#4b5563] italic">{edu.school}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={t.date}>{edu.year}</div>
                                                    {edu.grade && <div className="text-xs opacity-75 mt-1">{edu.grade}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* EXTRAS */}
                                {(resumeData.certifications.length > 0 || resumeData.achievements.length > 0) && (
                                    <section className="mb-6">
                                        <h2 className={t.sectionTitle}>Additional</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {resumeData.certifications.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-bold uppercase mb-2 opacity-70">Certifications</h3>
                                                    <ul className={`list-none space-y-1 ${t.body}`}>
                                                        {resumeData.certifications.map(cert => (
                                                            <li key={cert.id} className="flex justify-between">
                                                                <span>• {cert.name}</span>
                                                                <span className="opacity-60 text-xs">{cert.year}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {resumeData.achievements.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-bold uppercase mb-2 opacity-70">Achievements</h3>
                                                    <ul className={`list-none space-y-1 ${t.body}`}>
                                                        {resumeData.achievements.map(ach => (
                                                            <li key={ach.id}>• {ach.title}</li>
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
            {aiSuggestion && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-transparent">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <Wand2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">AI Suggestion</h2>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">{aiSuggestion.type} Enhancement</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Original</label>
                                <div className="p-3 bg-white/5 rounded-lg text-sm text-gray-400 border border-white/5 italic line-clamp-3">
                                    "{aiSuggestion.original}"
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-purple-400 uppercase mb-2 block">AI Improved</label>
                                <div className="p-4 bg-purple-500/5 rounded-xl text-white text-base leading-relaxed border border-purple-500/20 ring-1 ring-purple-500/10 whitespace-pre-line">
                                    {aiSuggestion.enhanced}
                                </div>
                                {aiSuggestion.warning && (
                                    <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                                        <span className="text-yellow-400 text-xs">⚠️</span>
                                        <p className="text-xs text-yellow-200/80">{aiSuggestion.warning}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 flex gap-3">
                            <button
                                onClick={() => setAiSuggestion(null)}
                                className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium"
                            >
                                Discard
                            </button>
                            <button
                                onClick={applyAISuggestion}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm font-bold"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
