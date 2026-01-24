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
        <div className="min-h-screen bg-black py-16 px-6 text-white font-['Outfit']">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* NAV */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard')}
                    className="group mb-12 flex items-center gap-2 text-gray-500 hover:text-white transition-all text-sm font-bold uppercase tracking-widest"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </motion.button>

                {/* HEADER */}
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                                <ShieldCheck size={24} className="text-red-400" />
                            </div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                                ATS <span className="text-indigo-400">Admin</span>
                            </h2>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase transition-all">
                            Platform <span className="text-red-500">Control</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-6 py-4 bg-white/[0.03] border border-white/5 rounded-3xl">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Live Status</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-sm font-bold">System Online</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'indigo' },
                        { label: 'Total Scans', value: stats?.scanActivities || 0, icon: FileSearch, color: 'emerald' },
                        { label: 'Total Drafts', value: stats?.createActivities || 0, icon: TrendingUp, color: 'purple' },
                        { label: 'Admin Count', value: stats?.totalAdmins || 0, icon: ShieldCheck, color: 'red' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#0a0a0b] border border-white/5 p-8 rounded-[40px] group hover:border-white/10 transition-all"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center mb-6 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">{stat.label}</span>
                            <div className="text-4xl font-black mt-2 tracking-tighter italic">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* ACTIVITY LOG */}
                <div className="bg-[#0a0a0b] border border-white/5 rounded-[40px] overflow-hidden">
                    <div className="p-10 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight">System Activity Log</h3>
                            <p className="text-gray-500 text-xs font-medium mt-1">Real-time breakdown of user interactions across the platform</p>
                        </div>
                        <Activity className="text-gray-800" size={32} />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                                    <th className="px-10 py-6">User</th>
                                    <th className="px-10 py-6">Action</th>
                                    <th className="px-10 py-6">Details</th>
                                    <th className="px-10 py-6">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {activities.map((act, i) => (
                                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black">
                                                    {act.user?.name?.charAt(0).toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-200">{act.user?.name || "Deleted User"}</div>
                                                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-tight">{act.user?.email || "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${act.type === 'RESUME_SCAN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                                                }`}>
                                                {act.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                                                {act.title}
                                                {act.details?.score && <span className="ml-2 px-2 py-0.5 bg-white/5 rounded text-xs font-black">{act.details.score}%</span>}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock size={12} />
                                                <span className="text-[10px] font-bold uppercase">
                                                    {new Date(act.createdAt).toLocaleDateString()} • {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {activities.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-20 text-center text-gray-600 text-sm font-bold uppercase tracking-[0.3em]">
                                            No system activity recorded yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-center text-[10px] text-gray-800 mt-24 font-black uppercase tracking-[0.6em] italic pointer-events-none">Admin Authority Module v1.0.a</p>
            </div>
        </div>
    );
};

export default AdminPanel;
