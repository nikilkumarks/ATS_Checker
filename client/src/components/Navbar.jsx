import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Layout, Activity, User, LogOut, Shield, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ showThemeToggle = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navItems = [
    { path: "/resume-builder", icon: Layout, label: "Builder" },
    { path: "/ats-scanner", icon: Activity, label: "Scanner" },
    { path: "/dashboard", icon: User, label: "Home" },
    ...(user.role === "admin" ? [{ path: "/admin-panel", icon: Shield, label: "Admin" }] : [])
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-border/50 bg-background/85 sm:bg-background/60 transition-all duration-500"
    >
      <div className="pointer-events-none absolute inset-0 lg:hidden bg-linear-to-r from-primary/10 via-background/70 to-blue-500/10" />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">

        {/* Logo Section */}
        <Link
          to={token ? "/dashboard" : "/"}
          className="flex items-center gap-2 sm:gap-3 active:scale-95 transition-transform group"
        >
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary shadow-lg shadow-primary/20 transition-all duration-500 shrink-0 flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              aria-hidden="true"
              className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground"
            >
              <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.85" />
              <circle cx="32" cy="32" r="9" fill="currentColor" opacity="0.95" />
              <path d="M14 32h10M40 32h10M32 14v10M32 40v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
              <path d="M45 45l8 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-black text-base sm:text-2xl tracking-tighter uppercase italic leading-none whitespace-nowrap">
            Hire<span className="text-primary">Lenz</span>
          </span>
        </Link>

        {/* Navigation Pill - Desktop (Visible only when logged in) */}
        {token && (
          <div className="hidden lg:flex items-center gap-1 bg-secondary/30 dark:bg-secondary/10 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${location.pathname === item.path
                  ? "bg-background text-primary shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
              >
                <item.icon size={14} strokeWidth={3} /> {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Actions/Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-4">

          {showThemeToggle && (
            <>
              {/* Enhanced Theme Toggle (Always visible unless hidden) */}
              <button
                onClick={toggleTheme}
                className="group relative flex items-center h-8 sm:h-9 w-14 sm:w-16 px-1.5 bg-secondary/80 dark:bg-secondary/40 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden"
                aria-label="Toggle Theme"
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-xl shadow-lg transition-all duration-500 ease-spring ${theme === 'dark'
                    ? 'translate-x-6 sm:translate-x-7 bg-indigo-600 text-white'
                    : 'bg-amber-400 text-amber-900'
                    }`}
                >
                  {theme === 'dark' ? <Moon size={14} fill="currentColor" /> : <Sun size={14} fill="currentColor" />}
                </div>

                {/* Background elements for toggle */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity bg-primary" />
              </button>

              <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />
            </>
          )}

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-300"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {token ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 pl-2 pr-4 py-1.5 bg-secondary/50 rounded-2xl border border-border/50">
                <div className="w-7 h-7 rounded-xl bg-linear-to-br from-primary to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-primary/20">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground leading-tight">
                    {user.name?.split(" ")[0]}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="hidden lg:inline-flex p-2 sm:p-2.5 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-4 py-2 hidden sm:block"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute right-3 sm:right-6 top-full mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-border/60 bg-linear-to-br from-background/95 via-background/90 to-primary/10 backdrop-blur-xl shadow-2xl shadow-black/30 p-3">
          <div className="grid gap-2">
            {token ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${location.pathname === item.path
                      ? "bg-background text-primary shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60 border border-transparent"
                      }`}
                  >
                    <item.icon size={14} strokeWidth={3} /> {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:bg-red-500/10 border border-transparent transition-all duration-300"
                >
                  <LogOut size={14} strokeWidth={3} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-border/50 text-foreground hover:bg-background/60 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
