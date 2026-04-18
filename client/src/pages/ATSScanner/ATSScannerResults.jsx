import React from 'react';
import { motion } from 'framer-motion';
import { SearchCode } from 'lucide-react';

const ATSScannerResults = ({ result, questions, attentionMap, roleRecommendations }) => {
    const score = Number.isFinite(Number(result?.score)) ? Number(result.score) : 0;
    const topRoleRecommendation = roleRecommendations[0];
    const secondaryRoleRecommendations = roleRecommendations.slice(1);
    
    const resultHighlights = [
        { label: 'Interview Questions', value: questions.length, tone: 'text-primary', detail: 'Questions to practice' },
        { label: 'Focus Areas', value: attentionMap.length, tone: 'text-emerald-500', detail: 'Important resume sections' },
        topRoleRecommendation
            ? {
                label: 'Best Role Match',
                value: `${topRoleRecommendation.match}%`,
                tone: 'text-yellow-500',
                detail: topRoleRecommendation.role
            }
            : {
                label: 'Best Role Match',
                value: '--',
                tone: 'text-yellow-500',
                detail: 'Available after scan'
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

    const getAttentionStyles = (attention) => {
        const level = String(attention || '').toLowerCase();

        if (level === 'high') {
            return {
                badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                bar: 'bg-emerald-500'
            };
        }

        if (level === 'medium') {
            return {
                badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
                bar: 'bg-amber-500'
            };
        }

        if (level === 'low') {
            return {
                badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
                bar: 'bg-rose-500'
            };
        }

        return {
            badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
            bar: 'bg-slate-500'
        };
    };

    const getAttentionLabel = (attention) => {
        const level = String(attention || '').toLowerCase();

        if (level === 'high') return 'High';
        if (level === 'medium') return 'Medium';
        if (level === 'low') return 'Low';
        return 'N/A';
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full space-y-10 sm:space-y-12 lg:space-y-16"
        >
            <div className="rounded-[40px] border border-border bg-card shadow-sm">
                <div className="p-5 sm:p-8 md:p-12 lg:p-16">
                    {/* Header */}
                    <div className="mb-10 sm:mb-12 lg:mb-16 flex flex-col gap-4 sm:gap-6 border-b border-border pb-8 sm:pb-10 lg:pb-12">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2.5 text-emerald-500 shadow-sm">
                            <SearchCode size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Scan Complete</span>
                        </div>
                        <h2 className="max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-balance">
                            Your <span className="text-foreground/30 italic">Results</span>
                        </h2>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 mb-12 sm:mb-16 lg:mb-20">
                        {resultHighlights.map((item) => (
                            <div key={item.label} className="group flex flex-col justify-between h-full rounded-3xl border border-border bg-background p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300 hover:border-primary/40">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 group-hover:text-primary transition-colors">{item.label}</p>
                                    <div className={`text-5xl sm:text-6xl font-black tracking-tighter ${item.tone} tabular-nums leading-none`}>
                                        {typeof item.value === 'number' ? String(item.value).padStart(2, '0') : item.value}
                                    </div>
                                </div>
                                <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40 border-t border-border pt-8">{item.detail}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 items-start gap-10 lg:gap-12 xl:grid-cols-[400px_minmax(0,1fr)] xl:gap-16">
                        {/* Sidebar */}
                        <aside className="space-y-10 xl:sticky xl:top-32 self-start animate-in fade-in slide-in-from-left-10 duration-1000">
                            <div className="rounded-[28px] border border-border bg-background p-6 sm:p-8 lg:p-12 shadow-sm flex items-center justify-center">
                                <div className="relative h-52 w-52 sm:h-60 sm:w-60 lg:h-72 lg:w-72 flex items-center justify-center">
                                    <svg viewBox="0 0 256 256" className="h-full w-full -rotate-90">
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
                                        <span className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter tabular-nums leading-none">
                                            {score}<span className="text-2xl lg:text-3xl text-foreground/20 italic">%</span>
                                        </span>
                                        <span className="mt-4 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40">Total Score</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 rounded-[28px] border border-border bg-background p-6 sm:p-8 lg:p-10">
                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Summary</h3>
                                    <p className="max-w-[36ch] text-lg sm:text-xl font-black leading-snug tracking-tight text-foreground/90 italic border-l-4 border-primary/30 pl-6 py-2">
                                        {result.summary ? `"${result.summary}"` : 'Your analysis is ready to view.'}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border bg-card p-8 space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/45">How to improve</p>
                                    <p className="text-sm leading-relaxed text-muted-foreground font-semibold">
                                        {result.analysis || 'Bridge keyword gaps and use more action words to improve your score.'}
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Analysis Grid */}
                        <div className="space-y-10 sm:space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                            {/* Keywords Matrix */}
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                                <div className="relative rounded-[28px] border border-border bg-background p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden group">
                                    <h3 className="mb-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">
                                        <div className="h-1 w-12 bg-emerald-500/30 rounded-full" /> Skills Found
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5 max-h-45 overflow-y-auto pr-2 custom-scrollbar">
                                        {result.foundKeywords?.map((kw, i) => (
                                            <span key={i} className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative rounded-[28px] border border-border bg-background p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden group">
                                    <h3 className="mb-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-yellow-500">
                                        <div className="h-1 w-12 bg-yellow-500/30 rounded-full" /> Missing Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5 max-h-45 overflow-y-auto pr-2 custom-scrollbar">
                                        {result.missingKeywords?.map((kw, i) => (
                                            <span key={i} className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-yellow-600 dark:text-yellow-400 transition-all hover:bg-yellow-500/20">
                                                + {kw}
                                            </span>
                                        )) || <p className="text-emerald-500/40 text-[9px] font-black uppercase tracking-[0.3em] py-2 whitespace-nowrap">None Found</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Interview & Heatmap Sections */}
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                                <div className="rounded-[28px] border border-border bg-background p-5 sm:p-8 lg:p-10 shadow-sm flex flex-col h-auto lg:h-130 min-h-0 overflow-hidden">
                                    <div className="mb-6 sm:mb-8 lg:mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6 shrink-0">
                                        <div className="space-y-1">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Sample Questions</h3>
                                            <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest opacity-60">Prepare for interviews</p>
                                        </div>
                                        <div className="rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">AI List</div>
                                    </div>

                                        <div className="space-y-4 overflow-visible lg:overflow-y-auto overflow-x-hidden pr-0 lg:pr-4 custom-scrollbar flex-1 min-h-0 pb-0 lg:pb-4">
                                        {questions.map((q, idx) => (
                                            <div key={idx} className="group p-5 sm:p-8 rounded-[20px] border border-border bg-card transition-all duration-300 hover:border-primary/40">
                                                <div className="mb-4 flex min-w-0 flex-wrap items-center gap-2.5">
                                                    <span className="max-w-full rounded-lg border border-primary/10 bg-primary/10 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-primary">{q.category}</span>
                                                    <span className={`max-w-full break-all rounded-lg border px-3 py-1 text-[9px] font-black uppercase tracking-wide ${q.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500 border-red-500/10' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10'}`}>
                                                        {q.difficulty}
                                                    </span>
                                                </div>
                                                <p className="max-w-[42ch] text-base sm:text-lg font-black leading-snug tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">{q.question}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-border bg-background p-5 sm:p-8 lg:p-10 shadow-sm flex flex-col h-auto lg:h-130 min-h-0 overflow-hidden">
                                    <div className="mb-6 sm:mb-8 lg:mb-10 space-y-1 shrink-0">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Reviewer Focus</h3>
                                        <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest opacity-60">Important sections</p>
                                    </div>

                                    <div className="space-y-6 overflow-visible lg:overflow-y-auto overflow-x-hidden pr-0 lg:pr-4 custom-scrollbar flex-1 min-h-0 pb-0 lg:pb-4">
                                        {attentionMap.map((item, idx) => (
                                            <div key={idx} className="group space-y-4 rounded-[20px] border border-border bg-card p-5 sm:p-8 transition-all duration-300">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h4 className="min-w-0 text-base sm:text-lg font-black tracking-tight leading-none">{item.section}</h4>
                                                    <span className={`shrink-0 rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${getAttentionStyles(item.attention).badge}`}>
                                                        {getAttentionLabel(item.attention)}
                                                    </span>
                                                </div>
                                                <p className="max-w-[44ch] text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 leading-relaxed">{item.reason}</p>
                                                <div className="relative h-2 w-full rounded-full bg-border/30 overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.score || 0}%` }}
                                                        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                                        className={`absolute inset-y-0 left-0 rounded-full ${getAttentionStyles(item.attention).bar}`} 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Suggested Roles */}
                    <div className="mt-14 sm:mt-16 lg:mt-20 rounded-4xl border border-border bg-card p-6 sm:p-8 lg:p-10 xl:p-14 shadow-sm">
                        <div>
                            <div className="mb-10 sm:mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-6 py-2 text-primary shadow-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Role Suggestions</span>
                                    </div>
                                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-none">Suggested <span className="text-foreground/30 italic">Roles</span></h3>
                                    <p className="max-w-xl text-sm sm:text-[12px] text-muted-foreground font-semibold leading-relaxed">These are roles that match your current profile.</p>
                                </div>
                            </div>

                            {topRoleRecommendation ? (
                                <div className="grid items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
                                    {/* Column 1: Top Choice */}
                                    <div className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-background p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300 hover:border-primary/60">
                                        <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                                            <div className="space-y-6">
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Top Role</p>
                                                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-tight text-balance">{topRoleRecommendation.role}</h4>
                                                <div className="flex items-center gap-4 pt-4 border-t border-border/20">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Estimated Salary: {formatSalary(topRoleRecommendation.salaryRange)}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col items-center justify-center h-24 w-24 rounded-[18px] border-2 border-primary/40 bg-card shrink-0">
                                                        <span className="text-3xl font-black tracking-tighter tabular-nums text-primary">{topRoleRecommendation.match}%</span>
                                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Role Match</span>
                                                    </div>
                                                    <p className="text-[14px] font-bold italic text-foreground/60 leading-snug line-clamp-3">"{topRoleRecommendation.roadmap?.[0] || 'Start with one improvement step.'}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Next Steps */}
                                    <div className="relative overflow-hidden rounded-3xl border border-border bg-background p-6 sm:p-8 lg:p-10 shadow-sm">
                                        <p className="mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Next Steps</p>
                                        <div className="space-y-6 max-h-none lg:max-h-75 overflow-visible lg:overflow-y-auto pr-0 lg:pr-4 custom-scrollbar">
                                            {(topRoleRecommendation.roadmap || []).slice(0, 3).map((step, idx) => (
                                                <div key={idx} className="flex gap-6 group">
                                                    <span className="text-2xl font-black text-primary/10 group-hover:text-primary transition-colors shrink-0">0{idx + 1}</span>
                                                    <p className="max-w-[34ch] text-[14px] sm:text-base font-bold text-foreground/75 leading-tight tracking-tight">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Column 3: Other Roles */}
                                    <div className="relative overflow-hidden rounded-3xl border border-border bg-background p-6 sm:p-8 lg:p-10 shadow-sm">
                                        <p className="mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Other Matching Roles</p>
                                        <div className="space-y-6 max-h-none lg:max-h-75 overflow-visible lg:overflow-y-auto pr-0 lg:pr-4 custom-scrollbar">
                                            {secondaryRoleRecommendations.slice(0, 3).map((role, idx) => (
                                                <div key={idx} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-300">
                                                    <div className="flex justify-between items-start gap-4 mb-5">
                                                        <h4 className="text-base font-black tracking-tighter leading-[1.1] text-balance">{role.role}</h4>
                                                        <div className="flex flex-col items-end shrink-0">
                                                            <span className="text-lg font-black text-primary/70">{role.match}%</span>
                                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Match</span>
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
                                  <div className="text-center py-20 bg-background rounded-3xl border-2 border-dashed border-border">
                                     <p className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/40">No role suggestions yet</p>
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
