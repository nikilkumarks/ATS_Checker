import React, { useState, useEffect } from 'react';
import API_URL from '../api/config';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    Target
} from 'lucide-react';

const ATSScanner = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
        <div className="min-h-screen bg-black py-16 px-6 text-white relative font-['Outfit'] overflow-x-hidden">
            {/* AMBIENT BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.05] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/[0.05] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* NAV */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard')}
                    className="group mb-12 flex items-center gap-2 text-gray-500 hover:text-white transition-all text-sm font-bold uppercase tracking-widest"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Dashboard</span>
                </motion.button>

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter italic">
                        ATS <span className="text-indigo-400">Scanner</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                        Compare your resume with any job description to see your match score and improve your keywords.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
                    {/* LEFT: INPUTS */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-[#0a0a0b] border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                <SearchCode size={160} />
                            </div>

                            <div className="relative z-10 space-y-12">
                                {/* Upload Step */}
                                <div className="space-y-6">
                                    <h3 className="font-black uppercase tracking-widest text-xs text-indigo-400">01. Upload Resume</h3>
                                    <label
                                        htmlFor="resume-upload"
                                        className={`block h-52 border-2 border-dashed rounded-[32px] p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group/upload ${file ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}`}
                                    >
                                        <input id="resume-upload" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />

                                        <div className="text-center">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-500 ${file ? 'bg-emerald-500 text-white scale-110' : 'bg-white/5 text-gray-500 group-hover/upload:scale-110'}`}>
                                                {file ? <FileText size={28} /> : <UploadCloud size={28} />}
                                            </div>
                                            <h4 className={`text-base font-bold mb-1 tracking-tight ${file ? 'text-emerald-400' : 'text-white'}`}>
                                                {file ? file.name : "Select File"}
                                            </h4>
                                            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                                                {file ? `${(file.size / 1024).toFixed(0)} KB` : "PDF or DOCX max 5MB"}
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* JD Step */}
                                <div className="space-y-6">
                                    <h3 className="font-black uppercase tracking-widest text-xs text-indigo-400">02. Job Description</h3>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the job description here..."
                                        className="w-full h-56 bg-white/[0.02] border border-white/10 rounded-[32px] p-8 text-white text-base placeholder-gray-700 focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all resize-none leading-relaxed font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ACTION */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#0a0a0b] border border-white/10 rounded-[40px] p-8 space-y-8 shadow-2xl sticky top-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Scan Controls</h3>

                                {error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleScan}
                                    disabled={!file || !jobDescription || scanning}
                                    className="w-full py-6 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-gray-200 transition-all active:scale-[0.96] disabled:opacity-20 flex items-center justify-center gap-3"
                                >
                                    {scanning ? (
                                        <>
                                            <div className="w-5 h-5 border-[3px] border-black/20 border-t-black rounded-full animate-spin" />
                                            <span>Scanning...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Activity size={18} strokeWidth={3} />
                                            <span>Start Scan</span>
                                        </>
                                    )}
                                </button>

                                <div className="pt-6 space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Accuracy</span>
                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">98% Verified</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="h-full bg-emerald-500/50" />
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
                            className="mt-16 bg-[#0a0a0b] border border-white/10 rounded-[40px] p-10 md:p-14 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                <Target size={240} />
                            </div>

                            <div className="relative z-10">
                                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-12">
                                    <h2 className="text-4xl font-black italic tracking-tighter uppercase">Scan <span className="text-gray-500">Results</span></h2>
                                </header>

                                <div className="grid grid-cols-1 lg:grid-cols-10 gap-16">
                                    {/* Score */}
                                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
                                        <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="16" fill="none" className="text-white/5" />
                                                <motion.circle
                                                    cx="128" cy="128" r="110"
                                                    stroke="currentColor" strokeWidth="16" fill="none"
                                                    strokeDasharray="691.15" initial={{ strokeDashoffset: 691.15 }}
                                                    animate={{ strokeDashoffset: 691.15 - (691.15 * result.score) / 100 }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className={`${result.score > 70 ? 'text-emerald-500' : result.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-7xl font-black italic tracking-tighter">{result.score}%</span>
                                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">Match Score</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4 max-w-sm">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 italic">Quick Summary</h3>
                                            <p className="text-gray-400 text-lg font-medium leading-[1.6] italic">"{result.summary}"</p>
                                        </div>
                                    </div>

                                    {/* Keywords */}
                                    <div className="lg:col-span-6 space-y-12">
                                        <div className="space-y-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-3">
                                                <div className="h-0.5 w-6 bg-emerald-400/30" /> Matched Keywords
                                            </h3>
                                            <div className="flex flex-wrap gap-2.5">
                                                {result.foundKeywords && result.foundKeywords.length > 0 ? result.foundKeywords.map((kw, i) => (
                                                    <span key={i} className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/10 font-bold uppercase">
                                                        {kw}
                                                    </span>
                                                )) : <p className="text-gray-600 text-xs italic">No matches found.</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-yellow-500 flex items-center gap-3">
                                                <div className="h-0.5 w-6 bg-yellow-500/30" /> Missing Keywords
                                            </h3>
                                            <div className="flex flex-wrap gap-2.5">
                                                {result.missingKeywords && result.missingKeywords.length > 0 ? result.missingKeywords.map((kw, i) => (
                                                    <span key={i} className="px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-400 text-xs border border-yellow-500/10 font-bold uppercase">
                                                        + {kw}
                                                    </span>
                                                )) : <p className="text-emerald-500 text-xs italic font-black uppercase">Resume Fully Optimized</p>}
                                            </div>
                                        </div>

                                        <div className="p-10 bg-white/[0.02] rounded-[32px] border border-white/5 space-y-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Expert Feedback</h3>
                                            <p className="text-gray-400 text-base leading-relaxed font-medium">
                                                {result.analysis || "Try adding more technical terms from the job description to your experience section."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-[10px] text-gray-800 mt-24 font-black uppercase tracking-[0.6em] italic pointer-events-none">Career Tool Version 2.4.b</p>
            </div>
        </div>
    );
};

export default ATSScanner;
