import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, FileText, UploadCloud } from 'lucide-react';

const ATSScannerForm = ({
    file,
    jobDescription,
    scanning,
    error,
    onFileChange,
    onJobDescriptionChange,
    onScan
}) => {
    return (
        <div className="relative overflow-hidden rounded-[56px] border border-border/50 bg-card/60 backdrop-blur-3xl shadow-2xl p-10 sm:p-14">
            <div className="absolute inset-0 bg-radial-at-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
            
            <div className="relative z-10 space-y-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pb-10 border-b border-border/40">
                    <div className="space-y-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">How to use</p>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">The Scanner</h2>
                        <p className="text-base text-muted-foreground font-semibold">Upload a resume and paste a job details to start.</p>
                    </div>
                    <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-[24px] bg-secondary border border-border/40 text-primary shadow-xl transform -rotate-12 transition-transform hover:rotate-0 duration-500">
                        <Cpu size={28} strokeWidth={2.5} />
                    </div>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-3xl border border-red-500/20 bg-red-500/10 px-8 py-5 text-red-500 text-[10px] font-black uppercase tracking-[0.25em] leading-relaxed flex items-center gap-5"
                    >
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
                        Error Info: {error}
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/80 ml-2">1. Upload Your Resume</h3>
                        <label
                            htmlFor="resume-upload"
                            className={`group relative flex min-h-[360px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[40px] border-2 border-dashed transition-all duration-700 ${file ? 'border-emerald-500/40 bg-emerald-500/5 shadow-inner' : 'border-border/60 bg-background/40 hover:border-primary/40 hover:bg-primary/[0.04] hover:shadow-2xl'}`}
                        >
                            <input id="resume-upload" type="file" accept=".pdf,.docx" className="hidden" onChange={onFileChange} />
                            
                            <div className="relative z-10 flex flex-col items-center text-center p-10 space-y-8">
                                <div className={`flex h-24 w-24 items-center justify-center rounded-[32px] transition-all duration-700 shadow-2xl ${file ? 'bg-emerald-500 text-white scale-105' : 'bg-background/90 text-foreground/30 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-12'}`}>
                                    {file ? <FileText size={48} strokeWidth={1.5} /> : <UploadCloud size={48} strokeWidth={1.5} />}
                                </div>
                                <div className="space-y-3">
                                    <h4 className={`text-xl font-black tracking-tight px-6 break-all leading-tight ${file ? 'text-emerald-500' : 'text-foreground/70'}`}>
                                        {file ? file.name : 'Select Resume'}
                                    </h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
                                        {file ? `${(file.size / 1024).toFixed(0)} KB · FILE LOCKED` : 'PDF or Word Document'}
                                    </p>
                                </div>
                            </div>
                            
                            {!file && (
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                    <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Click to upload</span>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/80 ml-2">2. Paste Job Details</h3>
                        <div className="relative h-full">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => onJobDescriptionChange(e.target.value)}
                                placeholder="Paste the job description here..."
                                className="h-full min-h-[360px] w-full resize-none rounded-[40px] border border-border/60 bg-background/40 p-10 text-base leading-relaxed text-foreground placeholder:text-foreground/20 outline-none transition-all duration-700 focus:border-primary/40 focus:bg-background/60 focus:ring-[12px] focus:ring-primary/[0.03] shadow-inner"
                            />
                            <div className="absolute bottom-8 right-10 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/10">
                                {jobDescription.length} characters
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-10 pt-8">
                    <button
                        onClick={onScan}
                        disabled={!file || !jobDescription || scanning}
                        className="group relative flex flex-1 h-20 sm:h-24 items-center justify-center gap-8 overflow-hidden rounded-[32px] bg-primary px-12 text-[12px] font-black uppercase tracking-[0.5em] text-primary-foreground shadow-2xl shadow-primary/20 transition-all duration-700 hover:-translate-y-2 hover:shadow-primary/40 active:scale-[0.97] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                        
                        {scanning ? (
                            <div className="flex items-center gap-5">
                                <div className="relative h-7 w-7">
                                    <div className="absolute inset-0 rounded-full border-[4px] border-primary-foreground/20" />
                                    <div className="absolute inset-0 rounded-full border-t-[4px] border-primary-foreground animate-spin" />
                                </div>
                                <span className="animate-pulse">Checking...</span>
                            </div>
                        ) : (
                            <>
                                <Activity size={28} strokeWidth={3} className="group-hover:scale-125 transition-transform duration-500" />
                                <span>Check My Match</span>
                            </>
                        )}
                    </button>
                    
                    <div className="flex flex-col items-center sm:items-end gap-3 px-10 py-6 rounded-[32px] border border-border/40 bg-background/40 shadow-xl min-w-[240px]">
                        <div className="flex items-center gap-5">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Status</span>
                            <div className="flex -space-x-1.5">
                                 <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                                 <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/30 animate-pulse delay-150" />
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80">Verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ATSScannerForm;
