import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ATSScanner = () => {
    const navigate = useNavigate();
    const [jobDescription, setJobDescription] = useState("");
    const [file, setFile] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

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
            const res = await fetch("http://localhost:5000/api/scan", {
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
        <div className="min-h-screen bg-[#0e0e10] p-8 text-white relative overflow-hidden font-inter">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-4xl mx-auto relative z-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                    ← Back to Dashboard
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        ATS Resume Scanner
                    </h1>
                    <p className="text-gray-400 text-lg">Compare your resume against a specific job description for maximum results.</p>
                </div>

                {/* Upload & JD Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Resume Upload */}
                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Step 1: Upload Resume</label>
                        <label
                            htmlFor="resume-upload"
                            className={`block h-64 bg-white/5 border-2 border-dashed ${file ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-emerald-500/50'} rounded-2xl p-8 backdrop-blur-xl text-center transition-all cursor-pointer group relative overflow-hidden flex flex-col items-center justify-center`}
                        >
                            <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <div className="relative z-10">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${file ? 'bg-emerald-500 text-white' : 'bg-gray-800/50 text-gray-400 group-hover:scale-110'}`}>
                                    {file ? <div className="text-2xl">📄</div> : (
                                        <svg className="w-6 h-6 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className={`text-lg font-semibold mb-1 transition-colors ${file ? 'text-emerald-300' : 'text-white group-hover:text-emerald-300'}`}>
                                    {file ? file.name : "Upload Resume"}
                                </h3>
                                <p className="text-gray-500 text-xs">
                                    {file ? "Click to change" : "PDF or DOCX (Max 5MB)"}
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Job Description */}
                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Step 2: Paste Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here (Role, Requirements, Skills)..."
                            className="w-full h-64 bg-white/5 border-2 border-white/10 rounded-2xl p-6 text-white placeholder-gray-600 focus:border-cyan-500/50 outline-none transition-all resize-none text-sm leading-relaxed"
                        />
                    </div>
                </div>

                <div className="max-w-xl mx-auto">
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleScan}
                        disabled={!file || !jobDescription || scanning}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {scanning ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analyzing Matching Score...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04 inter5.016 11.955 11.955 0 01-1.382 12.63 11.955 11.955 0 0110 0 11.955 11.955 0 0110-12.63 11.955 11.955 0 01-1.382-3.04z" />
                                </svg>
                                Run AI Analysis
                            </>
                        )}
                    </button>
                </div>

                {/* Results Area */}
                {result && (
                    <div className="mt-16 animate-slide-up">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold">Analysis Results</h2>
                                <span className="text-sm text-gray-400">Scan ID: #ATS-{Math.floor(Math.random() * 10000)}</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Score Circle */}
                                <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5 h-full">
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-800" />
                                            <circle
                                                cx="80" cy="80" r="72"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray="452.39"
                                                strokeDashoffset={452.39 - (452.39 * result.score) / 100}
                                                className={`${result.score > 70 ? 'text-emerald-400' : result.score > 40 ? 'text-yellow-400' : 'text-red-400'} transition-all duration-1000 ease-out`}
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-4xl font-black">{result.score}%</span>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Match</span>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-gray-400 font-medium italic text-center">"{result.summary}"</p>
                                </div>

                                {/* Keywords & Feedback */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Found Keywords */}
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Matched Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.foundKeywords && result.foundKeywords.length > 0 ? result.foundKeywords.map((kw, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-medium">
                                                    {kw}
                                                </span>
                                            )) : (
                                                <p className="text-gray-500 text-sm">No significant matches found.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Missing Keywords */}
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-yellow-400 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                            Keywords to Improve Score
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missingKeywords && result.missingKeywords.length > 0 ? result.missingKeywords.map((kw, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs border border-yellow-500/20 font-medium">
                                                    + {kw}
                                                </span>
                                            )) : (
                                                <p className="text-gray-500 text-sm">Great job! No major missing keywords identified.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Detailed Feedback */}
                                    <div className="p-6 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3 block">AI Analysis & Suggestions</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {result.analysis || "The scan detected several key areas for improvement. Focus on incorporating the missing keywords naturally into your experience section."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ATSScanner;
