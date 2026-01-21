import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ATSScanner = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError("");
        setResult(null);
    };

    const handleScan = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setScanning(true);
        const formData = new FormData();
        formData.append("resume", file);

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
                    <p className="text-gray-400 text-lg">Upload your resume to check its compatibility score against Job Descriptions.</p>
                </div>

                {/* Upload Area */}
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-xl">
                        <label
                            htmlFor="resume-upload"
                            className={`block bg-white/5 border-2 border-dashed ${file ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-emerald-500/50'} rounded-2xl p-12 backdrop-blur-xl text-center transition-all cursor-pointer group relative overflow-hidden`}
                        >
                            <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <div className="relative z-10">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${file ? 'bg-emerald-500 text-white' : 'bg-gray-800/50 text-gray-400 group-hover:scale-110'}`}>
                                    {file ? <div className="text-3xl">📄</div> : (
                                        <svg className="w-8 h-8 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className={`text-xl font-semibold mb-2 transition-colors ${file ? 'text-emerald-300' : 'text-white group-hover:text-emerald-300'}`}>
                                    {file ? file.name : "Upload your Resume"}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {file ? "Click to change file" : "PDF or DOCX (Max 5MB)"}
                                </p>
                            </div>
                        </label>

                        {error && (
                            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm animate-pulse">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleScan}
                            disabled={!file || scanning}
                            className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                        >
                            {scanning ? "Analyzing..." : "Running ATS Scan"}
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                {result && (
                    <div className="mt-16 animate-slide-up">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold">Analysis Results</h2>
                                <span className="text-sm text-gray-400">Scan ID: #ATS-{Math.floor(Math.random() * 10000)}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Score Circle */}
                                <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700" />
                                            <circle
                                                cx="64" cy="64" r="56"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray="351.86"
                                                strokeDashoffset={351.86 - (351.86 * result.score) / 100}
                                                className={`text-emerald-400 transition-all duration-1000 ease-out`}
                                            />
                                        </svg>
                                        <span className="absolute text-3xl font-bold">{result.score}</span>
                                    </div>
                                    <p className="mt-4 text-gray-400">ATS Compatibility</p>
                                </div>

                                {/* Keywords Found */}
                                <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <h3 className="text-lg font-semibold mb-4">Keywords Detected</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.foundKeywords.length > 0 ? result.foundKeywords.map((kw, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                                                {kw}
                                            </span>
                                        )) : (
                                            <p className="text-gray-500 text-sm">No common tech keywords found. Keep optimizing!</p>
                                        )}
                                    </div>
                                    <p className="mt-6 text-sm text-gray-500">
                                        * This is a demo analysis based on a fixed set of keywords (Javascript, React, etc). In a full version, this would compare against a specific Job Description.
                                    </p>
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
