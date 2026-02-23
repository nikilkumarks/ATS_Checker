import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api/config';
import {
    Users,
    Activity,
    ShieldCheck,
    ChevronLeft,
    TrendingUp,
    FileSearch,
    Clock,
    User as UserIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            if (!token || user.role !== 'admin') {
                navigate('/dashboard');
                return;
            }

            try {
                const [statsRes, activityRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/stats`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${API_URL}/api/admin/activities`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                if (!statsRes.ok || !activityRes.ok) {
                    throw new Error("Failed to fetch admin data");
                }

                const statsData = await statsRes.json();
                const activityData = await activityRes.json();

                setStats(statsData);
                setActivities(activityData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-primary/30 transition-colors duration-300 overflow-x-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-primary/5 blur-[140px] rounded-full animate-glow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/5 blur-[140px] rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 py-16 px-6">
                {/* NAV */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard')}
                    className="group mb-12 flex items-center gap-3 text-white/30 hover:text-primary transition-all text-[10px] font-black uppercase tracking-[0.4em] italic"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                    <span>Return to Command</span>
                </motion.button>

                {/* HEADER */}
                <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-5 mb-8">
                            <div className="p-4 bg-white/5 backdrop-blur-3xl rounded-[24px] border border-white/10 text-primary shadow-2xl relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <ShieldCheck size={28} className="relative z-10" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary leading-none mb-1">Administrative Node</span>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">
                                    System <span className="text-white/20">Authority</span>
                                </h2>
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase transition-all leading-[0.8]">
                            Tactical <span className="text-primary not-italic">Override</span>
                        </h1>
                    </div>

                    <div className="flex gap-6">
                        <div className="px-8 py-5 bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[32px] group relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="block text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-2 relative z-10">Network Pulse</span>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Infrastructure Online</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {[
                        { label: 'Total Operators', value: stats?.totalUsers || 0, icon: Users, color: 'primary' },
                        { label: 'Pulse Scans', value: stats?.scanActivities || 0, icon: FileSearch, color: 'indigo-500' },
                        { label: 'Created Drafts', value: stats?.createActivities || 0, icon: TrendingUp, color: 'emerald-500' },
                        { label: 'Authority Units', value: stats?.totalAdmins || 0, icon: ShieldCheck, color: 'red-500' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900/30 backdrop-blur-3xl border border-white/5 p-10 rounded-[48px] group relative overflow-hidden transition-all hover:border-white/10 shadow-2xl"
                        >
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-700" />
                            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-white group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:scale-110 transition-all duration-500 relative z-10 leading-none`}>
                                <stat.icon size={26} strokeWidth={3} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 relative z-10">{stat.label}</span>
                            <div className="text-5xl font-black mt-3 tracking-tighter italic relative z-10 leading-none">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* ACTIVITY LOG */}
                <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[56px] overflow-hidden shadow-2xl relative group">
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-all duration-1000" />

                    <div className="p-12 border-b border-white/5 flex items-center justify-between relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Activity size={18} className="text-primary" strokeWidth={3} />
                                <h3 className="text-2xl font-black italic uppercase tracking-tight">Deployment Telemetry</h3>
                            </div>
                            <p className="text-white/30 text-xs font-medium italic tracking-tight">Asynchronous event tracking across distributed authentication nodes</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[11px] font-black uppercase tracking-[0.4em] text-white/10 border-b border-white/5">
                                    <th className="px-12 py-8">Operator Detail</th>
                                    <th className="px-12 py-8">Action Protocol</th>
                                    <th className="px-12 py-8">Extraction Logic</th>
                                    <th className="px-12 py-8">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {activities.map((act, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group/row">
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-[18px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-[11px] font-black group-hover/row:bg-primary group-hover/row:text-primary-foreground group-hover/row:border-primary transition-all duration-300">
                                                    {act.user?.name?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <div className="text-base font-black italic tracking-tight text-white/90 group-hover/row:text-white transition-colors">{act.user?.name || "Terminated Node"}</div>
                                                    <div className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5">{act.user?.email || "VOID ACCESS"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${act.type === 'RESUME_SCAN'
                                                ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'
                                                : 'bg-primary/5 text-primary border-primary/20'
                                                }`}>
                                                {act.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="text-sm font-bold text-white/40 group-hover/row:text-white/80 transition-colors flex items-center gap-3 italic">
                                                {act.title}
                                                {act.details?.score && (
                                                    <span className="px-2 py-0.5 bg-white/5 rounded-lg text-[10px] font-black text-primary border border-white/5">
                                                        {act.details.score}% MATCH
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-3 text-white/20 group-hover/row:text-white/40 transition-colors">
                                                <Clock size={14} strokeWidth={3} />
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                    {new Date(act.createdAt).toLocaleDateString()} // {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {activities.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-12 py-32 text-center text-white/10 text-[11px] font-black uppercase tracking-[0.6em] italic">
                                            Telemetry Silence // No active signals detected
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-center text-[10px] text-white/5 mt-24 font-black uppercase tracking-[1em] italic pointer-events-none opacity-40">
                    Authority Override Framework // Access Level: Crimson Zero
                </p>
            </div>
        </div>
    );
};

export default AdminPanel;
