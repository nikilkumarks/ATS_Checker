import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, FileText, CheckCircle, BarChart } from "lucide-react";

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
        // Validate Token
        const dashRes = await fetch("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!dashRes.ok) throw new Error("Unauthorized");

        // Fetch Activity
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
      <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-inter">

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Navbar */}
        <header className="flex justify-between items-center mb-12 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                ATS Checker
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-sm font-medium text-gray-200 hidden sm:block">{user?.name || "User"}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in-up">

          {/* Create Resume Card */}
          <div
            onClick={() => navigate('/resume-builder')}
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 hover:border-purple-500/50 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  <FileText size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">Create Resume</h2>
                <p className="text-gray-400 mb-6">Build a professional, ATS-optimized resume from scratch using our industry-standard templates.</p>
              </div>

              <div className="flex items-center text-sm font-semibold text-purple-400 group-hover:text-white transition-colors">
                Start Building →
              </div>
            </div>
          </div>

          {/* ATS Analysis Card */}
          <div
            onClick={() => navigate('/ats-scanner')}
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 hover:border-emerald-500/50 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-emerald-600/5 to-emerald-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <CheckCircle size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-emerald-300 transition-colors">ATS Score Analysis</h2>
                <p className="text-gray-400 mb-6">Analyze your existing resume against job descriptions to get an ATS compatibility score and key insights.</p>
              </div>

              <div className="flex items-center text-sm font-semibold text-emerald-400 group-hover:text-white transition-colors">
                Analyze Now →
              </div>
            </div>
          </div>

        </div>

        {/* Dashboard Widgets / Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          {/* Recent Activity */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart size={18} className="text-indigo-400" /> Recent Activity
              </h3>
            </div>

            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <div className="text-4xl mb-2">💤</div>
                  <p>No activity found</p>
                  <span className="text-xs">Your recent scans and resumes will appear here.</span>
                </div>
              ) : (
                activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === 'RESUME_SCAN' ? 'bg-orange-500/20 text-orange-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        {activity.type === 'RESUME_SCAN' ? <CheckCircle size={18} /> : <FileText size={18} />}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-200">{activity.title}</h4>
                        <p className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {activity.details?.score && (
                      <span className={`text-xs px-2 py-1 rounded border ${activity.details.score >= 70 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                        {activity.details.score} Score
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Tips / Status */}
          <div className="bg-gradient-to-b from-indigo-900/30 to-purple-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>Use standard section headings like "Experience" and "Education".</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>Avoid using graphics or columns that ATS parsers might miss.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>Tailor keywords to the specific job description.</span>
              </li>
            </ul>
            <button className="w-full mt-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors">
              Read Guide
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}