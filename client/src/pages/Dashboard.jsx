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
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob bg-primary/20 top-[-10%] left-[-10%] w-[60%] h-[60%]" />
        <div className="blob bg-indigo-600/20 bottom-[-10%] right-[-10%] w-[60%] h-[60%] animate-pulse" />
        <div className="blob bg-emerald-500/10 top-[20%] right-[10%] w-[30%] h-[30%] animate-float" />
      </div>

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-10 z-10">

        {/* WELCOME */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 w-fit rounded-full border border-primary/20">
                <Sparkles size={12} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intelligence Portal</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8] mb-2 flex items-center gap-4 flex-wrap">
                Welcome, <span className="text-primary">{user?.name?.split(' ')[0] || "Leader"}</span>
                {toggles.newDashboard && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-black px-4 py-1.5 bg-indigo-600 text-white rounded-full uppercase tracking-widest italic"
                  >
                    Beta UI
                  </motion.span>
                )}
              </h1>
              <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">
                Your ATS performance is optimized and ready for deployment
              </p>
            </div>
          </div>
        </motion.section>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/resume-builder')}
            className="group relative p-1 leading-none rounded-[40px] bg-card border border-border cursor-pointer overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
          >
            <div className="p-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl group-hover:shadow-primary/20">
                  <Plus size={32} strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black mb-4 italic tracking-tighter uppercase">Resume <span className="text-muted-foreground">Forge</span></h3>
                <p className="text-muted-foreground text-base font-medium leading-relaxed mb-8">
                  Create a professional, ATS-ready resume with AI help.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary transition-colors">
                Start Building <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/ats-scanner')}
            className="group relative p-1 leading-none rounded-[40px] bg-card border border-border cursor-pointer overflow-hidden transition-all duration-500 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/5"
          >
            <div className="p-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 flex items-center justify-center mb-8 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-emerald-500/20">
                  <Zap size={32} strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black mb-4 italic tracking-tighter uppercase">ATS <span className="text-muted-foreground">Scanner</span></h3>
                <p className="text-muted-foreground text-base font-medium leading-relaxed mb-8">
                  Check how well your resume matches a job description.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-500 transition-colors">
                Run Scanner <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-xl"
        >
          <div className="relative z-10 mb-8">
            <h3 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <div className="w-1 h-4 bg-primary rounded-full" />
              Activity
            </h3>
            <h4 className="text-2xl font-black italic uppercase tracking-tight">Recent History</h4>
          </div>

          <div className="space-y-4 relative z-10">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-secondary/30 rounded-[32px] border border-border border-dashed">
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No activities yet</p>
              </div>
            ) : (
              <div className="grid gap-3">
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
                    className="group flex items-center justify-between p-5 rounded-3xl bg-secondary/50 hover:bg-secondary transition-all border border-border hover:border-primary/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${activity.type === 'RESUME_SCAN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                        {activity.type === 'RESUME_SCAN' ? <Zap size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">{activity.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {activity.details?.score && (
                        <div className="flex flex-col items-end">
                          <span className={`text-xl font-black italic tracking-tighter ${activity.details.score >= 70 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                            {activity.details.score}%
                          </span>
                        </div>
                      )}
                      <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-foreground transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-center text-[10px] text-muted-foreground mt-24 font-black uppercase tracking-[0.6em] italic opacity-40">ATS Checker Professional</p>
      </div >
    </div >
  );
}

