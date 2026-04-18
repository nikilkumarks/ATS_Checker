import React from 'react';
import { Activity } from 'lucide-react';

const heroStats = [
    { label: 'Resume Scan', value: 'Quick check' },
    { label: 'Interview Prep', value: 'Question ideas' },
    { label: 'Role Fit', value: 'Match score' },
    { label: 'Focus Areas', value: 'What to improve' }
];

const ATSScannerHero = () => {
    return (
        <section className="grid items-center gap-8 md:gap-10 xl:grid-cols-[1.2fr_0.8fr] mb-12 sm:mb-16 lg:mb-20">
            <div className="flex flex-col justify-center space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-2.5 text-primary shadow-sm">
                    <Activity size={12} />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">HireLenz Scanner</span>
                </div>

                <div className="space-y-5 sm:space-y-6">
                    <h1 className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-[96px] font-black tracking-tighter leading-[0.9] text-balance">
                        Check your <span className="text-primary italic">Resume Match</span>
                    </h1>
                    <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-semibold opacity-80">
                        Upload your resume, add a job description, and get a clear score with helpful feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {heroStats.map((item, idx) => (
                        <div 
                            key={item.label} 
                            className="group relative flex min-h-28 flex-col justify-between rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-primary/40"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/30 group-hover:text-primary transition-colors">{item.label}</p>
                            <p className="text-base sm:text-lg font-black tracking-tight">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-4xl border border-border bg-card p-6 sm:p-8 lg:p-12 shadow-sm animate-in fade-in slide-in-from-right-10 duration-1000 h-full flex flex-col justify-center">
                <div className="relative z-10 space-y-8 sm:space-y-10">
                    <div className="flex items-start justify-between gap-6 sm:gap-8">
                        <div className="space-y-3">
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">How it works</p>
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tighter leading-none">Simple Steps</h3>
                            <p className="max-w-md text-sm sm:text-base text-muted-foreground font-semibold leading-relaxed">Upload your resume and paste the job details to start.</p>
                        </div>
                        <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary text-primary-foreground shrink-0">
                            <Activity size={28} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-3xl border border-border bg-background p-5 sm:p-6 lg:p-8 text-sm">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">What you need</p>
                            <p className="font-bold text-foreground/70 leading-relaxed text-sm sm:text-base">A resume file and the job description.</p>
                        </div>
                        <div className="h-px bg-border/20 w-full" />
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">What you get</p>
                            <p className="font-bold text-foreground/70 leading-relaxed text-sm sm:text-base">Match score, missing skills, and suggested next steps.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-background px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Status</span>
                        <div className="flex items-center gap-4 text-emerald-500">
                            <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Ready to scan</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ATSScannerHero;
