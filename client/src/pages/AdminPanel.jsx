import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api/config';
import {
    Users,
    Activity,
    ShieldCheck,
    TrendingUp,
    FileSearch,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import BackNavigation from '../components/BackNavigation';

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
            <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users },
        { label: 'Resume Scans', value: stats?.scanActivities || 0, icon: FileSearch },
        { label: 'Resume Builds', value: stats?.createActivities || 0, icon: TrendingUp },
        { label: 'Admins', value: stats?.totalAdmins || 0, icon: ShieldCheck }
    ];

    const formatActivityType = (type = '') => type.replace('_', ' ');

    const formatTimestamp = (date) => {
        const parsed = new Date(date);
        return `${parsed.toLocaleDateString()} ${parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
            <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="mb-6 sm:mb-8">
                        <BackNavigation fallbackTo="/dashboard" />
                    </div>
                </motion.div>

                <header className="mb-8 sm:mb-10 flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Admin Panel</p>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Admin Dashboard</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            View users, activity, and system stats in one place.
                        </p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">System Online</span>
                    </div>
                </header>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm"
                        >
                            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <stat.icon size={22} strokeWidth={2.5} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-muted-foreground">{stat.label}</p>
                            <p className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">{stat.value}</p>
                        </motion.div>
                    ))}
                </section>

                <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex items-center gap-3">
                        <Activity size={18} className="text-primary" />
                        <div>
                            <h2 className="text-lg sm:text-xl font-black tracking-tight">Recent Activity</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">Latest actions from users and admins</p>
                        </div>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden p-4 space-y-3">
                        {activities.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center text-sm font-semibold text-muted-foreground">
                                No activity found.
                            </div>
                        ) : (
                            activities.map((act, i) => (
                                <div key={i} className="rounded-2xl border border-border bg-background p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-black text-foreground">{act.user?.name || 'Unknown User'}</p>
                                            <p className="text-xs text-muted-foreground break-all">{act.user?.email || 'No email'}</p>
                                        </div>
                                        <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                            {formatActivityType(act.type)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/90">{act.title}</p>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock size={13} />
                                            <span>{formatTimestamp(act.createdAt)}</span>
                                        </div>
                                        {act.details?.score !== undefined && (
                                            <span className="text-xs font-black text-emerald-500">{act.details.score}% Match</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center text-sm font-semibold text-muted-foreground">
                                            No activity found.
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((act, i) => (
                                        <tr key={i} className="border-b border-border last:border-b-0 hover:bg-background/70 transition-colors">
                                            <td className="px-6 py-4 align-top">
                                                <p className="text-sm font-black text-foreground">{act.user?.name || 'Unknown User'}</p>
                                                <p className="text-xs text-muted-foreground break-all">{act.user?.email || 'No email'}</p>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                                    {formatActivityType(act.type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-top text-sm text-foreground/90">
                                                <div className="flex items-center gap-2">
                                                    <span>{act.title}</span>
                                                    {act.details?.score !== undefined && (
                                                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-500">
                                                            {act.details.score}% Match
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top text-xs text-muted-foreground whitespace-nowrap">
                                                {formatTimestamp(act.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminPanel;
