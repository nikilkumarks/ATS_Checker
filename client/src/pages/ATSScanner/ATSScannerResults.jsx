import React from 'react';
import { motion } from 'framer-motion';
import { SearchCode } from 'lucide-react';

const ATSScannerResults = ({ result, questions, attentionMap, roleRecommendations }) => {
    const score = Number.isFinite(Number(result?.score)) ? Number(result.score) : 0;
    const topRoleRecommendation = roleRecommendations[0];
    const secondaryRoleRecommendations = roleRecommendations.slice(1);
    
    const resultHighlights = [
        { label: 'Sample Questions', value: questions.length, tone: 'text-primary', detail: 'Prep for success' },
        { label: 'Focus Areas', value: attentionMap.length, tone: 'text-emerald-500', detail: 'Key points found' },
        topRoleRecommendation
            ? {
                label: 'Suggested Role',
                value: `${topRoleRecommendation.match}%`,
                tone: 'text-yellow-500',
                detail: topRoleRecommendation.role
            }
            : {
                label: 'Suggested Role',
                value: '--',
                tone: 'text-yellow-500',
                detail: 'Pending scan'
            }
    ];

    const formatSalary = (salaryStr) => {
        if (!salaryStr) return '₹--';
        // Market Correction: Aligning US-based data to Realistic Indian Market Rates
        // Using a PPP/Market correction factor of ~0.45x for Realistic Indian benchmarks
        return salaryStr.replace(/\$([0-9.]+)(k|m)?/gi, (match, val, unit) => {
            let value = parseFloat(val);
            if (unit?.toLowerCase() === 'k') value *= 1000;
            if (unit?.toLowerCase() === 'm') value *= 1000000;
            
            // Apply PPP/Market Correction for real Indian office rates
            const inrValue = value * 83 * 0.45; 
            
            if (inrValue >= 10000000) {
                return `₹${(inrValue / 10000000).toFixed(1)} Cr`;
            } else if (inrValue >= 100000) {
                return `₹${(inrValue / 100000).toFixed(0)}L`;
            }
            return `₹${(inrValue / 1000).toFixed(0)}k`;
        });
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full space-y-16"
        >
            <div className="relative overflow-hidden rounded-[48px] border border-border/50 bg-card/60 backdrop-blur-3xl shadow-2xl">
                {/* Ambient Background Accents */}
                <div className="absolute -top-64 -left-64 h-[800px] w-[800px] rounded-full bg-primary/10 blur-[160px] dark:opacity-40 pointer-events-none" />
                <div className="absolute -bottom-64 -right-64 h-[800px] w-[800px] rounded-full bg-cyan-500/10 blur-[160px] dark:opacity-40 pointer-events-none" />

                <div className="relative z-10 p-8 sm:p-12 md:p-16">
                    {/* Header */}
                    <div className="mb-16 flex flex-col gap-6 border-b border-border/40 pb-12">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2.5 text-emerald-500 shadow-sm">
                            <SearchCode size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Scan Complete</span>
                        </div>
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.85] text-balance">
                            Scan <span className="text-foreground/20 italic">Results</span>
                        </h2>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                        {resultHighlights.map((item) => (
                            <div key={item.label} className="group flex flex-col justify-between h-full rounded-[32px] border border-border/50 bg-background/50 p-10 shadow-sm transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 group-hover:text-primary transition-colors">{item.label}</p>
                                    <div className={`text-5xl sm:text-6xl font-black tracking-tighter ${item.tone} tabular-nums leading-none`}>
                                        {typeof item.value === 'number' ? String(item.value).padStart(2, '0') : item.value}
                                    </div>
                                </div>
                                <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/30 border-t border-border/20 pt-8">{item.detail}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 items-start gap-16 xl:grid-cols-[420px_1fr]">
                        {/* Sidebar */}
                        <aside className="space-y-10 xl:sticky xl:top-32 self-start animate-in fade-in slide-in-from-left-10 duration-1000">
                            <div className="rounded-[40px] border border-border/50 bg-background/60 p-12 shadow-xl relative overflow-hidden group flex items-center justify-center">
                                <div className="absolute inset-0 bg-radial-at-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative h-64 w-64 lg:h-72 lg:w-72 flex items-center justify-center">
                                    <svg viewBox="0 0 256 256" className="h-full w-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(var(--primary),0.15)]">
                                        <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="14" fill="none" className="text-border/40" />
                                        <motion.circle
                                            cx="128"
                                            cy="128"
                                            r="110"
                                            stroke="currentColor"
                                            strokeWidth="14"
                                            fill="none"
                                            strokeDasharray="691.15"
                                            initial={{ strokeDashoffset: 691.15 }}
                                            animate={{ strokeDashoffset: 691.15 - (691.15 * score) / 100 }}
                                            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                                            className={score > 70 ? 'text-emerald-500' : score > 40 ? 'text-yellow-500' : 'text-red-500'}
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center text-center">
                                        <span className="text-7xl lg:text-8xl font-black tracking-tighter tabular-nums leading-none">
                                            {score}<span className="text-2xl lg:text-3xl text-foreground/20 italic">%</span>
                                        </span>
                                        <span className="mt-4 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40">Total Score</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10 rounded-[40px] border border-border/50 bg-primary/[0.03] p-10 shadow-inner">
                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Summary</h3>
                                    <p className="text-xl font-black leading-snug tracking-tight text-foreground/90 italic border-l-4 border-primary/30 pl-8 py-2">
                                        {result.summary ? `"${result.summary}"` : 'Your analysis is ready to view.'}
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-border/40 bg-background/80 p-10 space-y-4 shadow-sm">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/45">To Improve</p>
                                    <p className="text-sm leading-relaxed text-muted-foreground font-semibold">
                                        {result.analysis || 'Bridge keyword gaps and use more action words to improve your score.'}
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Analysis Grid */}
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                            {/* Keywords Matrix */}
                            <div className="grid gap-10 lg:grid-cols-2">
                                <div className="relative rounded-[40px] border border-border/50 bg-background/50 p-10 shadow-sm overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] pointer-events-none" />
                                    <h3 className="mb-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">
                                        <div className="h-1 w-12 bg-emerald-500/30 rounded-full" /> Skills Found
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                        {result.foundKeywords?.map((kw, i) => (
                                            <span key={i} className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative rounded-[40px] border border-border/50 bg-background/50 p-10 shadow-sm overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[40px] pointer-events-none" />
                                    <h3 className="mb-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-yellow-500">
                                        <div className="h-1 w-12 bg-yellow-500/30 rounded-full" /> Missing Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                        {result.missingKeywords?.map((kw, i) => (
                                            <span key={i} className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-yellow-600 dark:text-yellow-400 transition-all hover:bg-yellow-500/20">
                                                + {kw}
                                            </span>
                                        )) || <p className="text-emerald-500/40 text-[9px] font-black uppercase tracking-[0.3em] py-2 whitespace-nowrap">None Found</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Interview & Heatmap Sections */}
                            <div className="grid gap-10 lg:grid-cols-2">
                                <div className="rounded-[40px] border border-border/50 bg-background/50 p-10 shadow-sm flex flex-col h-[520px]">
                                    <div className="mb-10 flex items-center justify-between gap-6 shrink-0">
                                        <div className="space-y-1">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Sample Questions</h3>
                                            <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.1em] opacity-60">Prepare for interviews</p>
                                        </div>
                                        <div className="rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">AI List</div>
                                    </div>

                                    <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar flex-1 pb-4">
                                        {questions.map((q, idx) => (
                                            <div key={idx} className="group p-8 rounded-[28px] border border-border/40 bg-card/60 transition-all duration-300 hover:bg-card/90 hover:border-primary/40">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="rounded-lg bg-primary/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-primary border border-primary/10">{q.category}</span>
                                                    <span className={`rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] border ${q.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500 border-red-500/10' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10'}`}>
                                                        {q.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-base font-black leading-snug tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">{q.question}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[40px] border border-border/50 bg-background/50 p-10 shadow-sm flex flex-col h-[520px]">
                                    <div className="mb-10 space-y-1 shrink-0">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Recruiter Focus</h3>
                                        <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.1em] opacity-60">Important sections</p>
                                    </div>

                                    <div className="space-y-6 overflow-y-auto pr-4 custom-scrollbar flex-1 pb-4">
                                        {attentionMap.map((item, idx) => (
                                            <div key={idx} className="group space-y-4 rounded-[28px] border border-border/40 bg-card/60 p-8 transition-all duration-300 hover:bg-card/80">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <h4 className="text-base font-black tracking-tight leading-none">{item.section}</h4>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{item.reason}</p>
                                                    </div>
                                                    <span className={`rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${item.attention === 'high' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                                        {item.attention}
                                                    </span>
                                                </div>
                                                <div className="relative h-2 w-full rounded-full bg-border/30 overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.score || 0}%` }}
                                                        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                                        className={`absolute inset-y-0 left-0 rounded-full ${item.attention === 'high' ? 'bg-emerald-500' : 'bg-yellow-500'}`} 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Suggested Roles - Full Width Breakout for Horizontal Impact */}
                    <div className="mt-20 relative overflow-hidden rounded-[56px] border border-border/50 bg-card/40 backdrop-blur-3xl p-10 sm:p-14 shadow-2xl">
                        {/* Vector Accents */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] -mr-48 -mt-24 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] -ml-24 -mb-16 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-6 py-2 text-primary shadow-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Best Match</span>
                                    </div>
                                    <h3 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">Suggested <span className="text-foreground/20 italic">Roles</span></h3>
                                    <p className="max-w-xl text-muted-foreground text-[11px] font-bold leading-relaxed opacity-70 uppercase tracking-[0.25em]">Based on industry standards and your skills.</p>
                                </div>
                            </div>

                            {topRoleRecommendation ? (
                                <div className="grid items-stretch gap-8 lg:grid-cols-3">
                                    {/* Column 1: Top Choice */}
                                    <div className="group relative overflow-hidden rounded-[40px] border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-background/40 to-background/60 p-10 shadow-xl transition-all duration-700 hover:border-primary/60">
                                        <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                                            <div className="space-y-6">
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Top Choice</p>
                                                <h4 className="text-3xl lg:text-4xl font-black tracking-tighter leading-tight text-balance">{topRoleRecommendation.role}</h4>
                                                <div className="flex items-center gap-4 pt-4 border-t border-border/20">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">{formatSalary(topRoleRecommendation.salaryRange)}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col items-center justify-center h-24 w-24 rounded-[32px] border-2 border-primary/40 bg-card shadow-2xl backdrop-blur-2xl shrink-0">
                                                        <span className="text-3xl font-black tracking-tighter tabular-nums text-primary">{topRoleRecommendation.match}%</span>
                                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Match</span>
                                                    </div>
                                                    <p className="text-[14px] font-bold italic text-foreground/60 leading-snug line-clamp-3">"{topRoleRecommendation.roadmap?.[0] || 'Calibration Nominal.'}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Next Steps */}
                                    <div className="relative overflow-hidden rounded-[40px] border border-border/40 bg-background/30 p-10 shadow-xl">
                                        <p className="mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Next Steps</p>
                                        <div className="space-y-8 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                            {(topRoleRecommendation.roadmap || []).slice(0, 3).map((step, idx) => (
                                                <div key={idx} className="flex gap-6 group">
                                                    <span className="text-2xl font-black text-primary/10 group-hover:text-primary transition-colors shrink-0">0{idx + 1}</span>
                                                    <p className="text-[14px] font-bold text-foreground/75 leading-tight tracking-tight">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Column 3: Other Roles */}
                                    <div className="relative overflow-hidden rounded-[40px] border border-border/40 bg-background/30 p-10 shadow-xl">
                                        <p className="mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Other Roles</p>
                                        <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                            {secondaryRoleRecommendations.slice(0, 3).map((role, idx) => (
                                                <div key={idx} className="group p-6 rounded-[24px] border border-border/30 bg-card/40 hover:border-primary/40 transition-all duration-500">
                                                    <div className="flex justify-between items-start gap-4 mb-5">
                                                        <h4 className="text-base font-black tracking-tighter leading-[1.1] text-balance">{role.role}</h4>
                                                        <div className="flex flex-col items-end shrink-0">
                                                            <span className="text-lg font-black text-primary/70">{role.match}%</span>
                                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Signal</span>
                                                        </div>
                                                    </div>
                                                    <div className="relative h-1 w-full bg-border/20 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${role.match}%` }}
                                                            transition={{ duration: 1.5, delay: idx * 0.1 }}
                                                            className="absolute inset-y-0 left-0 bg-primary/30" 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-background/20 rounded-[44px] border-2 border-dashed border-border/40">
                                     <p className="text-[11px] font-black uppercase tracking-[0.5em] text-foreground/20 italic">Awaiting Signal Calibration</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default ATSScannerResults;
