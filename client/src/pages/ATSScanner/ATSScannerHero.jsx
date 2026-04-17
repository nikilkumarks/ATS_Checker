import React from 'react';
import { Activity } from 'lucide-react';

const heroStats = [
    { label: 'Resume Scan', value: '1 step' },
    { label: 'Interview Prep', value: 'AI guided' },
    { label: 'Role Fit', value: 'Resume only' },
    { label: 'Attention Map', value: 'Visual guide' }
];

const ATSScannerHero = () => {
    return (
        <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] mb-16 sm:mb-20">
            <div className="flex flex-col justify-center space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-2.5 text-primary backdrop-blur-xl shadow-sm">
                    <Activity size={12} className="animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">AI Matching</span>
                </div>

                <div className="space-y-6">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-black tracking-tighter leading-[0.8] text-balance">
                        Get your <span className="text-primary italic">Dream Job</span>
                    </h1>
                    <p className="max-w-xl text-xl sm:text-2xl text-muted-foreground leading-relaxed font-semibold opacity-80">
                        Use our AI to see if your resume matches the job you want.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {heroStats.map((item, idx) => (
                        <div 
                            key={item.label} 
                            className="group relative flex flex-col justify-between rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-sm transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1.5"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/30 group-hover:text-primary transition-colors">{item.label}</p>
                            <p className="text-base sm:text-lg font-black tracking-tight">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative overflow-hidden rounded-[56px] border border-border/50 bg-card/60 backdrop-blur-3xl shadow-2xl p-10 sm:p-12 animate-in fade-in slide-in-from-right-10 duration-1000 h-full flex flex-col justify-center">
                <div className="absolute inset-0 bg-radial-at-tl from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                <div className="relative z-10 space-y-10">
                    <div className="flex items-start justify-between gap-8">
                        <div className="space-y-3">
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">How it works</p>
                            <h3 className="text-3xl font-black tracking-tighter leading-none">The Scanner</h3>
                            <p className="text-base text-muted-foreground font-semibold leading-relaxed">Upload a resume and paste a job to start.</p>
                        </div>
                        <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary shadow-2xl shadow-primary/30 text-primary-foreground transform rotate-6 hover:rotate-0 transition-transform duration-500 shrink-0">
                            <Activity size={28} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="grid gap-6 rounded-[32px] border border-dashed border-border/40 bg-background/40 p-8 text-sm">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">What you need</p>
                            <p className="font-bold text-foreground/70 leading-relaxed text-base">Resume file and a Job Description.</p>
                        </div>
                        <div className="h-px bg-border/20 w-full" />
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">What you get</p>
                            <p className="font-bold text-foreground/70 leading-relaxed text-base">Your match score, missing skills, and career tips.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 rounded-3xl border border-border/50 bg-background/60 px-8 py-6 shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Status</span>
                        <div className="flex items-center gap-4 text-emerald-500">
                            <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Verified by AI</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ATSScannerHero;
