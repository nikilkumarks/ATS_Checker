import { Link, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e0e10]/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-black italic tracking-tighter uppercase text-white"
        >
          <div className="p-1.5 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
            <Zap size={18} fill="white" className="text-white" />
          </div>
          ATS <span className="text-indigo-400">Checker</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className={`text-sm transition ${location.pathname === "/login"
                ? "text-white"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-500 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
