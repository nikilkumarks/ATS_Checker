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
        <div className="rounded-4xl border border-border bg-card shadow-sm p-5 sm:p-8 lg:p-12">
            <div className="relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-8 pb-8 sm:pb-10 border-b border-border">
                    <div className="space-y-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">How to use</p>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none">Scan Your Resume</h2>
                        <p className="max-w-xl text-sm sm:text-base text-muted-foreground font-semibold">Upload your resume and paste the job description.</p>
                    </div>
                    <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-[20px] bg-secondary border border-border text-primary">
                        <Cpu size={28} strokeWidth={2.5} />
                    </div>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl border border-red-500/30 bg-red-50 dark:bg-red-950/20 px-6 py-4 text-red-600 dark:text-red-400 text-sm font-semibold leading-relaxed flex items-center gap-3"
                    >
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        {error}
                    </motion.div>
                )}

                <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                    <div className="space-y-6">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/80 ml-2">1. Upload Resume</h3>
                        <label
                            htmlFor="resume-upload"
                            className={`group relative flex min-h-72 sm:min-h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${file ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-background hover:border-primary/40'}`}
                        >
                            <input id="resume-upload" type="file" accept=".pdf,.docx" className="hidden" onChange={onFileChange} />
                            
                            <div className="relative z-10 flex flex-col items-center text-center p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
                                <div className={`flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[20px] transition-all duration-300 ${file ? 'bg-emerald-500 text-white' : 'bg-background text-foreground/40 group-hover:bg-primary group-hover:text-white'}`}>
                                    {file ? <FileText size={40} className="sm:size-12" strokeWidth={1.5} /> : <UploadCloud size={40} className="sm:size-12" strokeWidth={1.5} />}
                                </div>
                                <div className="space-y-3">
                                    <h4 className={`max-w-full px-2 sm:px-6 text-lg sm:text-xl font-black tracking-tight wrap-break-word leading-tight ${file ? 'text-emerald-500' : 'text-foreground/70'}`}>
                                        {file ? file.name : 'Choose Resume File'}
                                    </h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
                                        {file ? `${(file.size / 1024).toFixed(0)} KB` : 'PDF or Word file'}
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
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/80 ml-2">2. Paste Job Description</h3>
                        <div className="relative h-full">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => onJobDescriptionChange(e.target.value)}
                                placeholder="Paste the job description here..."
                                className="h-full min-h-72 sm:min-h-80 w-full resize-none rounded-3xl border border-border bg-background p-5 sm:p-6 lg:p-10 text-sm sm:text-base leading-relaxed text-foreground placeholder:text-foreground/40 outline-none transition-all duration-300 focus:border-primary/50"
                            />
                            <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-10 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">
                                {jobDescription.length} characters
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-2 sm:pt-6 max-w-5xl">
                    <button
                        onClick={onScan}
                        disabled={!file || !jobDescription || scanning}
                        className="group relative flex w-full flex-1 h-16 sm:h-20 lg:h-24 items-center justify-center gap-4 sm:gap-6 overflow-hidden rounded-3xl bg-primary px-6 sm:px-10 lg:px-12 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-primary-foreground transition-all duration-300 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {scanning ? (
                            <div className="flex items-center gap-4 sm:gap-5">
                                <div className="relative h-6 w-6 sm:h-7 sm:w-7">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/20" />
                                    <div className="absolute inset-0 rounded-full border-t-4 border-primary-foreground animate-spin" />
                                </div>
                                <span>Scanning...</span>
                            </div>
                        ) : (
                            <>
                                <Activity size={24} strokeWidth={3} />
                                <span>Check My Match</span>
                            </>
                        )}
                    </button>
                    
                    <div className="flex w-full flex-col items-center sm:items-end gap-3 rounded-3xl border border-border bg-background px-5 py-5 sm:px-8 sm:py-6 sm:w-auto sm:min-w-0">
                        <div className="flex items-center gap-5">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Status</span>
                            <div className="flex -space-x-1.5">
                                 <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                 <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/30" />
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400">Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ATSScannerForm;
