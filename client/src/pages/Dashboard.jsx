import { useEffect, useState } from "react";
import API_URL from "../api/config";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  FileText,
  Plus,
  Zap,
  LayoutDashboard,
  ArrowUpRight,
  Search,
  ChevronRight,
  Shield,
  Moon,
  Sun
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useToggle } from "../context/ToggleContext";
import Navbar from "../components/Navbar";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toggles } = useToggle();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const dashRes = await fetch(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!dashRes.ok) throw new Error("Unauthorized");

        const dashData = await dashRes.json();
        if (dashData.user) {
          setUser(dashData.user);
          localStorage.setItem("user", JSON.stringify(dashData.user));
        }

        const activityRes = await fetch(`${API_URL}/api/activity`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (activityRes.ok) {
          const data = await activityRes.json();
          setActivities(data);
        }
      } catch (err) {
        console.error(err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-300 overflow-x-hidden">
      {/* AMBIENT BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[140px] rounded-full animate-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 z-10">
        {/* WELCOME */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 sm:mb-12 md:mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 w-fit rounded-full border border-border/50 backdrop-blur-md">
                <Sparkles size={12} className="text-primary" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">Your Success Dashboard</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] sm:leading-[0.8] mb-2 flex items-center gap-3 sm:gap-4 flex-wrap">
                Welcome, <span className="text-primary not-italic">{user?.name?.split(' ')[0] || "Operator"}</span>
                {toggles.newDashboard && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[10px] sm:text-xs font-black px-3 sm:px-4 py-1.5 bg-indigo-600 text-white rounded-full uppercase tracking-[0.2em] sm:tracking-widest italic"
                  >
                    Beta
                  </motion.span>
                )}
              </h1>
              <p className="text-muted-foreground font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[9px] sm:text-[10px] opacity-40 ml-1">
                Everything is ready to go · System Status: Online
              </p>
            </div>
          </div>
        </motion.section>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/resume-builder')}
            className="group relative p-[1px] rounded-3xl sm:rounded-[40px] bg-gradient-to-br from-border/50 to-transparent cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="bg-card/60 backdrop-blur-3xl p-6 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[40px] h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all" />

              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl sm:rounded-[24px] bg-secondary/50 flex items-center justify-center mb-6 sm:mb-8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl group-hover:shadow-primary/20">
                  <Plus size={32} strokeWidth={3} />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4 italic tracking-tighter uppercase leading-none">Resume <span className="text-foreground/20">Builder</span></h3>
                <p className="text-muted-foreground text-sm sm:text-base font-medium leading-relaxed mb-6 sm:mb-8 opacity-70">
                  Create professional, ATS-ready resumes in minutes with our builder.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary transition-colors">
                Start Building <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/ats-scanner')}
            className="group relative p-[1px] rounded-3xl sm:rounded-[40px] bg-gradient-to-br from-border/50 to-transparent cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10"
          >
            <div className="bg-card/60 backdrop-blur-3xl p-6 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[40px] h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-all" />

              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl sm:rounded-[24px] bg-secondary/50 flex items-center justify-center mb-6 sm:mb-8 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-emerald-500/20">
                  <Zap size={32} strokeWidth={3} />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4 italic tracking-tighter uppercase leading-none">ATS <span className="opacity-20">Scanner</span></h3>
                <p className="text-muted-foreground text-sm sm:text-base font-medium leading-relaxed mb-6 sm:mb-8 opacity-70">
                  Compare your resume against job descriptions to see how you match up.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-emerald-500 transition-colors">
                Check Score <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* RECENT LOGS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 md:p-12 relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 mb-6 sm:mb-10 flex justify-between items-end">
            <div>
              <h3 className="text-[9px] sm:text-[10px] font-black flex items-center gap-2 sm:gap-3 uppercase tracking-[0.25em] sm:tracking-[0.4em] text-primary mb-3 sm:mb-4">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Recent Activity
              </h3>
              <h4 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">Scan History</h4>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 sm:py-24 bg-secondary/30 rounded-3xl sm:rounded-[32px] border border-border/10 border-dashed">
                <p className="text-[9px] sm:text-[10px] font-black text-foreground/20 uppercase tracking-[0.25em] sm:tracking-[0.5em] text-center">No activity logs found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {activities.map((activity, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    key={index}
                    onClick={() => {
                      if (activity.type === 'RESUME_SCAN') {
                        navigate('/ats-scanner', { state: { result: activity.details } });
                      } else {
                        navigate('/resume-builder');
                      }
                    }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-secondary/30 hover:bg-secondary/50 transition-all border border-border/10 hover:border-primary/20 cursor-pointer shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto min-w-0">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner shrink-0 ${activity.type === 'RESUME_SCAN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                        {activity.type === 'RESUME_SCAN' ? <Zap size={22} strokeWidth={2.5} /> : <FileText size={22} strokeWidth={2.5} />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-sm sm:text-base text-foreground tracking-tight group-hover:text-primary transition-colors uppercase italic break-words">{activity.title}</h4>
                        <p className="text-[8px] sm:text-[9px] text-foreground/30 font-black mt-1.5 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                          {new Date(activity.createdAt).toLocaleTimeString()} · {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-end">
                      {activity.details?.score && (
                        <div className="flex flex-col items-end">
                          <span className={`text-xl sm:text-2xl font-black italic tracking-tighter ${activity.details.score >= 70 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                            {activity.details.score}%
                          </span>
                        </div>
                      )}
                      <div className="p-3 bg-secondary/30 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <ArrowUpRight size={18} strokeWidth={3} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-center text-[9px] sm:text-[10px] text-foreground/10 mt-14 sm:mt-20 font-black uppercase tracking-[0.3em] sm:tracking-[0.8em] italic">
          ATS Checker · Helping You Get Hired
        </p>
      </div >
    </div >
  );
}

