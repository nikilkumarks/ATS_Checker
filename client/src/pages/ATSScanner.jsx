import React, { useState, useEffect } from 'react';
import API_URL from '../api/config';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import {
    ChevronLeft,
    UploadCloud,
    FileText,
    Cpu,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    SearchCode,
    Activity,
    Target,
    Sun,
    Moon
} from 'lucide-react';

const ATSScanner = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [jobDescription, setJobDescription] = useState("");
    const [file, setFile] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (location.state?.result) {
            setResult(location.state.result);
            if (location.state.jobDescription) {
                setJobDescription(location.state.jobDescription);
            }
        }
    }, [location.state]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError("");
    };

    const handleScan = async () => {
        if (!file) {
            setError("Please upload a resume first.");
            return;
        }
        if (!jobDescription.trim()) {
            setError("Please enter a job description to scan against.");
            return;
        }

        setScanning(true);
        setError("");

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobDescription", jobDescription);

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/api/scan`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Scan failed");
            }

            setResult(data);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-300 overflow-x-hidden">
            <Navbar />

            {/* AMBIENT BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[140px] rounded-full animate-glow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 md:pb-16 px-4 sm:px-6">
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 sm:mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/50 w-fit rounded-full border border-border/50 backdrop-blur-md mb-4 sm:mb-6">
                        <Activity size={12} className="text-primary" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">Match Your Resume</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 tracking-tighter italic uppercase leading-[0.85] sm:leading-[0.8] flex flex-col">
                        ATS <span className="text-primary not-italic">Scanner</span>
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl font-medium leading-relaxed opacity-60">
                        Check your resume against job requirements to see how well you match the role.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-start mb-10 sm:mb-12 md:mb-16">
                    {/* LEFT: INPUTS */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-10">
                        <div className="bg-card/60 backdrop-blur-3xl border border-border/50 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />

                            <div className="relative z-10 space-y-8 sm:space-y-12">
                                {/* Upload Step */}
                                <div className="space-y-4 sm:space-y-6">
                                    <h3 className="font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] text-[9px] sm:text-[10px] text-primary italic">1. Upload Your Resume</h3>
                                    <label
                                        htmlFor="resume-upload"
                                        className={`block h-44 sm:h-52 border-2 border-dashed rounded-2xl sm:rounded-[32px] p-5 sm:p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group/upload ${file ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/50 hover:border-primary/30 hover:bg-secondary/30'}`}
                                    >
                                        <input id="resume-upload" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />

                                        <div className="text-center relative z-10">
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 transition-all duration-500 ${file ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/20' : 'bg-secondary/50 text-muted-foreground group-hover/upload:scale-110'}`}>
                                                {file ? <FileText size={28} /> : <UploadCloud size={28} />}
                                            </div>
                                            <h4 className={`text-sm sm:text-base font-black italic uppercase tracking-tighter mb-1 break-words ${file ? 'text-emerald-500' : 'text-foreground'}`}>
                                                {file ? file.name : "Select Resume"}
                                            </h4>
                                            <p className="text-foreground/20 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.3em]">
                                                {file ? `${(file.size / 1024).toFixed(0)} KB · FILE SELECTED` : "PDF or DOCX files preferred"}
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* JD Step */}
                                <div className="space-y-4 sm:space-y-6">
                                    <h3 className="font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] text-[9px] sm:text-[10px] text-primary italic">2. Paste Job Details</h3>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the job description here..."
                                        className="w-full h-44 sm:h-52 md:h-56 bg-secondary/30 border border-border/50 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 md:p-8 text-foreground text-sm sm:text-base placeholder:text-foreground/20 sm:placeholder:text-foreground/10 focus:border-primary/40 focus:bg-secondary/50 outline-none transition-all resize-none leading-relaxed font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ACTION */}
                    <div className="lg:col-span-4">
                        <div className="bg-card/60 backdrop-blur-3xl border border-border/50 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 space-y-6 sm:space-y-8 shadow-2xl lg:sticky lg:top-24 overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />

                            <div className="relative z-10 space-y-4">
                                <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] text-foreground/20">Scanner Options</h3>

                                {error && (
                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed"
                                    >
                                        Error: {error}
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleScan}
                                    disabled={!file || !jobDescription || scanning}
                                    className="relative w-full overflow-hidden group/btn px-5 sm:px-8 py-4 sm:py-5 bg-primary text-primary-foreground font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-2xl disabled:opacity-20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                    {scanning ? (
                                        <>
                                            <div className="w-5 h-5 border-[3px] border-foreground/20 border-t-foreground rounded-full animate-spin" />
                                            <span>Scanning...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Activity size={18} strokeWidth={3} />
                                            <span>Check My Match</span>
                                        </>
                                    )}
                                </button>

                                <div className="pt-6 space-y-5">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[8px] sm:text-[9px] font-black text-foreground/20 uppercase tracking-[0.15em] sm:tracking-[0.3em]">Scanner Precision</span>
                                        <span className="text-[8px] sm:text-[9px] font-black text-emerald-500 uppercase tracking-[0.15em] sm:tracking-[0.3em]">AI Verified</span>
                                    </div>
                                    <div className="h-1 bg-secondary/50 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '99.4%' }} className="h-full bg-emerald-500/40" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RESULTS */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-10 sm:mt-12 md:mt-16 bg-card/40 backdrop-blur-3xl border border-border/50 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 md:p-10 lg:p-14 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 blur-[120px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />

                            <div className="relative z-10">
                                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16 border-b border-border/50 pb-6 sm:pb-10 md:pb-12">
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Your <span className="text-foreground/20">Results</span></h2>
                                </header>

                                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 sm:gap-10 lg:gap-16">
                                    {/* Score */}
                                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
                                        <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center mb-6 sm:mb-10 group/score">
                                            <div className="absolute inset-0 bg-secondary/5 rounded-full blur-[80px] opacity-0 group-hover/score:opacity-100 transition-opacity" />
                                            <svg viewBox="0 0 256 256" preserveAspectRatio="xMidYMid meet" className="w-full h-full -rotate-90 relative z-10">
                                                <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="20" fill="none" className="text-secondary/50" />
                                                <motion.circle
                                                    cx="128" cy="128" r="110"
                                                    stroke="currentColor" strokeWidth="20" fill="none"
                                                    strokeDasharray="691.15" initial={{ strokeDashoffset: 691.15 }}
                                                    animate={{ strokeDashoffset: 691.15 - (691.15 * result.score) / 100 }}
                                                    transition={{ duration: 2, ease: "circOut" }}
                                                    className={`${result.score > 70 ? 'text-emerald-500' : result.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center z-20">
                                                <span className="text-5xl sm:text-7xl md:text-8xl font-black italic tracking-tighter leading-none">{result.score}<span className="text-2xl sm:text-3xl text-foreground/50">%</span></span>
                                                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-foreground/20 mt-2">Match Score</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3 sm:space-y-4 max-w-sm text-center lg:text-left">
                                            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-primary italic">Expert Advice</h3>
                                            <p className="text-foreground text-base sm:text-lg md:text-xl font-black italic tracking-tight leading-[1.35] sm:leading-[1.4] opacity-80 break-words">"{result.summary}"</p>
                                        </div>
                                    </div>

                                    {/* Keywords */}
                                    <div className="lg:col-span-6 space-y-8 sm:space-y-12">
                                        <div className="space-y-4 sm:space-y-6">
                                            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.5em] text-emerald-500 flex items-center gap-3 sm:gap-4">
                                                <div className="h-[1px] w-8 bg-emerald-500/40" /> Good Keywords Found
                                            </h3>
                                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                                {result.foundKeywords && result.foundKeywords.length > 0 ? result.foundKeywords.map((kw, i) => (
                                                    <span key={i} className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[9px] sm:text-[10px] border border-emerald-500/10 font-black uppercase tracking-[0.12em] sm:tracking-widest shadow-lg shadow-emerald-500/5 break-words">
                                                        {kw}
                                                    </span>
                                                )) : <p className="text-foreground/20 text-[10px] font-black uppercase tracking-widest italic">No matching keywords found.</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-4 sm:space-y-6">
                                            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.5em] text-yellow-500 flex items-center gap-3 sm:gap-4">
                                                <div className="h-[1px] w-8 bg-yellow-500/40" /> Recommended Keywords
                                            </h3>
                                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                                {result.missingKeywords && result.missingKeywords.length > 0 ? result.missingKeywords.map((kw, i) => (
                                                    <span key={i} className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-yellow-500/10 text-yellow-500 text-[9px] sm:text-[10px] border border-yellow-500/10 font-black uppercase tracking-[0.12em] sm:tracking-widest shadow-lg shadow-yellow-500/5 hover:bg-yellow-500/20 transition-colors break-words">
                                                        + {kw}
                                                    </span>
                                                )) : <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em] italic">All Keywords Present</p>}
                                            </div>
                                        </div>

                                        <div className="p-5 sm:p-8 md:p-10 bg-secondary/30 rounded-2xl sm:rounded-[32px] border border-border/50 space-y-4 sm:space-y-5 relative overflow-hidden group/feedback">
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/feedback:opacity-100 transition-opacity" />
                                            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.5em] text-primary relative z-10">How to Improve</h3>
                                            <p className="text-foreground/60 text-sm sm:text-base md:text-lg leading-relaxed font-medium relative z-10 break-words">
                                                {result.analysis || "Try adding more technical skills and action verbs related to the job description."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-[9px] sm:text-[10px] text-foreground/10 mt-14 sm:mt-20 md:mt-24 font-black uppercase tracking-[0.3em] sm:tracking-[0.8em] italic opacity-40">Career Match Tool // Version 1.0</p>
            </div>
        </div>
    );
};

export default ATSScanner;

