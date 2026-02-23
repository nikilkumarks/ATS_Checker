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

            <div className="max-w-5xl mx-auto relative z-10 pt-32 pb-16 px-6">
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/50 w-fit rounded-full border border-border/50 backdrop-blur-md mb-6">
                        <Activity size={12} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Pulse Analysis Engine</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic uppercase leading-[0.8] flex flex-col">
                        ATS <span className="text-primary not-italic">Scanner</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed opacity-60">
                        Deploy precise pulse-scanning against proprietary tracking algorithms to identify protocol gaps in your documentation.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
                    {/* LEFT: INPUTS */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-card/60 backdrop-blur-3xl border border-border/50 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />

                            <div className="relative z-10 space-y-12">
                                {/* Upload Step */}
                                <div className="space-y-6">
                                    <h3 className="font-black uppercase tracking-[0.4em] text-[10px] text-primary italic">01 // Document Upload</h3>
                                    <label
                                        htmlFor="resume-upload"
                                        className={`block h-52 border-2 border-dashed rounded-[32px] p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group/upload ${file ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/5 hover:border-primary/30 hover:bg-white/5'}`}
                                    >
                                        <input id="resume-upload" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />

                                        <div className="text-center relative z-10">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-500 ${file ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-muted-foreground group-hover/upload:scale-110'}`}>
                                                {file ? <FileText size={28} /> : <UploadCloud size={28} />}
                                            </div>
                                            <h4 className={`text-base font-black italic uppercase tracking-tighter mb-1 ${file ? 'text-emerald-500' : 'text-white'}`}>
                                                {file ? file.name : "Initialize Upload"}
                                            </h4>
                                            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">
                                                {file ? `${(file.size / 1024).toFixed(0)} KB · SYSTEM READY` : "PDF / DOCX · Tier 1 Clearance"}
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* JD Step */}
                                <div className="space-y-6">
                                    <h3 className="font-black uppercase tracking-[0.4em] text-[10px] text-primary italic">02 // Comparison Matrix</h3>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the target job description protocols here..."
                                        className="w-full h-56 bg-white/[0.03] border border-white/5 rounded-[32px] p-8 text-white text-base placeholder-white/10 focus:border-primary/40 focus:bg-white/[0.05] outline-none transition-all resize-none leading-relaxed font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ACTION */}
                    <div className="lg:col-span-4">
                        <div className="bg-card/60 backdrop-blur-3xl border border-border/50 rounded-[40px] p-8 space-y-8 shadow-2xl sticky top-24 overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />

                            <div className="relative z-10 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">System Controls</h3>

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
                                    className="relative w-full overflow-hidden group/btn px-8 py-5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] rounded-2xl disabled:opacity-20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                    {scanning ? (
                                        <>
                                            <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                                            <span>Analyzing Pulse...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Activity size={18} strokeWidth={3} />
                                            <span>Execute Scan</span>
                                        </>
                                    )}
                                </button>

                                <div className="pt-6 space-y-5">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Protocol Accuracy</span>
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">99.4% Valid</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
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
                            className="mt-16 bg-card/40 backdrop-blur-3xl border border-border/50 rounded-[40px] p-10 md:p-14 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 blur-[120px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />

                            <div className="relative z-10">
                                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-border/50 pb-12">
                                    <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Extraction <span className="text-foreground/20">Data</span></h2>
                                </header>

                                <div className="grid grid-cols-1 lg:grid-cols-10 gap-16">
                                    {/* Score */}
                                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
                                        <div className="relative w-64 h-64 flex items-center justify-center mb-10 group/score">
                                            <div className="absolute inset-0 bg-white/5 rounded-full blur-[80px] opacity-0 group-hover/score:opacity-100 transition-opacity" />
                                            <svg className="w-full h-full -rotate-90 relative z-10">
                                                <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="20" fill="none" className="text-white/5" />
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
                                                <span className="text-8xl font-black italic tracking-tighter leading-none">{result.score}<span className="text-3xl text-white/50">%</span></span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-2">Protocol Match</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4 max-w-sm">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Intelligence Summary</h3>
                                            <p className="text-white text-xl font-black italic tracking-tight leading-[1.4] opacity-80">"{result.summary}"</p>
                                        </div>
                                    </div>

                                    {/* Keywords */}
                                    <div className="lg:col-span-6 space-y-12">
                                        <div className="space-y-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 flex items-center gap-4">
                                                <div className="h-[1px] w-8 bg-emerald-500/40" /> Logged Artifacts
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {result.foundKeywords && result.foundKeywords.length > 0 ? result.foundKeywords.map((kw, i) => (
                                                    <span key={i} className="px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] border border-emerald-500/10 font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5">
                                                        {kw}
                                                    </span>
                                                )) : <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">No matching protocols identified.</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-500 flex items-center gap-4">
                                                <div className="h-[1px] w-8 bg-yellow-500/40" /> Recommended Uplinks
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {result.missingKeywords && result.missingKeywords.length > 0 ? result.missingKeywords.map((kw, i) => (
                                                    <span key={i} className="px-5 py-2.5 rounded-xl bg-yellow-500/10 text-yellow-500 text-[10px] border border-yellow-500/10 font-black uppercase tracking-widest shadow-lg shadow-yellow-500/5 hover:bg-yellow-500/20 transition-colors">
                                                        + {kw}
                                                    </span>
                                                )) : <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em] italic">Protocols Fully Optimized</p>}
                                            </div>
                                        </div>

                                        <div className="p-10 bg-white/[0.03] rounded-[32px] border border-white/5 space-y-5 relative overflow-hidden group/feedback">
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/feedback:opacity-100 transition-opacity" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary relative z-10">Strategic Guidance</h3>
                                            <p className="text-white/60 text-lg leading-relaxed font-medium relative z-10">
                                                {result.analysis || "Protocols suggest integrating additional high-frequency technical descriptors within the experience logic chains."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-[10px] text-white/10 mt-24 font-black uppercase tracking-[0.8em] italic opacity-40">Operational Scanning Framework · V7.4</p>
            </div>
        </div>
    );
};

export default ATSScanner;

