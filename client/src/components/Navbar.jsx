import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, Sun, Moon, Layout, Activity, User, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-border/50 transition-all duration-500"
      style={{
        backgroundColor: theme === 'dark'
          ? 'color-mix(in srgb, var(--background), transparent 60%)'
          : 'color-mix(in srgb, var(--background), transparent 40%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo Section */}
        <Link
          to={token ? "/dashboard" : "/"}
          className="flex items-center gap-3 active:scale-95 transition-transform group"
        >
          <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
            <Zap size={22} fill="currentColor" className="text-primary-foreground" />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase italic leading-none">
            ATS <span className="text-primary">Checker</span>
          </span>
        </Link>

        {/* Navigation Pill - Desktop (Visible only when logged in) */}
        {token && (
          <div className="hidden md:flex items-center gap-1 bg-secondary/30 dark:bg-secondary/10 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md">
            {[
              { path: "/resume-builder", icon: Layout, label: "Forge" },
              { path: "/ats-scanner", icon: Activity, label: "Scanner" },
              { path: "/dashboard", icon: User, label: "Home" },
              { path: "/settings", icon: SettingsIcon, label: "Settings" }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${location.pathname === item.path
                  ? "bg-background text-primary shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
              >
                <item.icon size={14} /> {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Actions/Theme Toggle */}
        <div className="flex items-center gap-4">

          {/* Enhanced Theme Toggle (Only visible and functional for logged-in users) */}
          {token && (
            <button
              onClick={toggleTheme}
              className="group relative flex items-center h-9 w-16 px-1.5 bg-secondary/80 dark:bg-secondary/40 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden"
              aria-label="Toggle Theme"
            >
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-xl shadow-lg transition-all duration-500 ease-spring ${theme === 'dark'
                  ? 'translate-x-7 bg-indigo-600 text-white'
                  : 'bg-amber-400 text-amber-900'
                  }`}
              >
                {theme === 'dark' ? <Moon size={14} fill="currentColor" /> : <Sun size={14} fill="currentColor" />}
              </div>

              {/* Background elements for toggle */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity bg-primary" />
            </button>
          )}

          <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

          {token ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 pl-2 pr-4 py-1.5 bg-secondary/50 rounded-2xl border border-border/50">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-primary/20">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground leading-tight">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase leading-tight">Pro Member</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-4 py-2 hidden sm:block"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
