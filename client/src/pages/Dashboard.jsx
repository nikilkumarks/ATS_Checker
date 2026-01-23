import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  FileText,
  Plus,
  Zap,
  LayoutDashboard,
  ArrowUpRight,
  Search,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        const dashRes = await fetch("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!dashRes.ok) throw new Error("Unauthorized");

        const activityRes = await fetch("http://localhost:5000/api/activity", {
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
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-['Outfit'] overflow-x-hidden">
      {/* AMBIENT BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/[0.05] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/[0.05] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10 z-10">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-16"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <LayoutDashboard size={24} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">
              ATS <span className="text-indigo-400">Checker</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] rounded-2xl border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-500/20">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-xs font-black text-white">{user?.name || "User"}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-90"
            >
              <LogOut size={20} className="text-gray-400" />
            </button>
          </div>
        </motion.header>

        {/* WELCOME */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            Hello, <span className="text-indigo-400">{user?.name?.split(' ')[0] || 'User'}</span>.
          </h2>
          <p className="text-gray-400 font-medium max-w-xl text-lg leading-relaxed">
            Select a tool below to get started with your resume.
          </p>
        </motion.section>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/resume-builder')}
            className="group relative p-1 leading-none rounded-[40px] bg-[#0a0a0b] border border-white/5 cursor-pointer overflow-hidden transition-all duration-500 hover:border-indigo-500/40 hover:bg-white/[0.02]"
          >
            <div className="p-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-16 h-16 rounded-[24px] bg-indigo-500/20 flex items-center justify-center mb-8 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-indigo-500/20">
                  <Plus size={32} strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black mb-4 italic tracking-tighter uppercase">Resume <span className="text-gray-500">Forge</span></h3>
                <p className="text-gray-400 text-base font-medium leading-relaxed mb-8">
                  Create a professional, ATS-ready resume with AI help.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-400 group-hover:text-white transition-colors">
                Start Building <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute bottom-[-20%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <FileText size={240} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/ats-scanner')}
            className="group relative p-1 leading-none rounded-[40px] bg-[#0a0a0b] border border-white/5 cursor-pointer overflow-hidden transition-all duration-500 hover:border-emerald-500/40 hover:bg-white/[0.02]"
          >
            <div className="p-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-16 h-16 rounded-[24px] bg-emerald-500/20 flex items-center justify-center mb-8 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-emerald-500/20">
                  <Zap size={32} strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black mb-4 italic tracking-tighter uppercase">ATS <span className="text-gray-500">Scanner</span></h3>
                <p className="text-gray-400 text-base font-medium leading-relaxed mb-8">
                  Check how well your resume matches a job description and get a detailed score.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-400 group-hover:text-white transition-colors">
                Run Scanner <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute bottom-[-20%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Search size={240} />
            </div>
          </motion.div>
        </div>

        {/* ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0a0a0b] border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden"
        >
          <div className="relative z-10 mb-8">
            <h3 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.2em] text-gray-500 mb-4">
              <div className="w-1 h-4 bg-indigo-500/50 rounded-full" />
              Activity
            </h3>
            <h4 className="text-2xl font-black italic transition-colors uppercase tracking-tight">Recent History</h4>
          </div>

          <div className="space-y-4 relative z-10">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] rounded-[32px] border border-white/5 border-dashed">
                <p className="text-sm font-black text-gray-500 uppercase tracking-widest leading-loose">No activities yet</p>
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
                    className="group flex items-center justify-between p-5 rounded-3xl bg-white/[0.01] hover:bg-white/[0.03] transition-all border border-white/5 hover:border-indigo-500/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${activity.type === 'RESUME_SCAN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        {activity.type === 'RESUME_SCAN' ? <Zap size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-gray-200 tracking-tight group-hover:text-white transition-colors">{activity.title}</h4>
                        <p className="text-[10px] text-gray-600 font-bold mt-1 uppercase tracking-wider">
                          {new Date(activity.createdAt).toLocaleDateString()} • {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {activity.details?.score && (
                        <div className="flex flex-col items-end">
                          <span className={`text-xl font-black italic tracking-tighter ${activity.details.score >= 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                            {activity.details.score}%
                          </span>
                        </div>
                      )}
                      <ArrowUpRight size={16} className="text-gray-800 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-center text-[10px] text-gray-800 mt-24 font-black uppercase tracking-[0.6em] italic pointer-events-none">Career Tool Version 2.4.b</p>
      </div >
    </div >
  );
}
