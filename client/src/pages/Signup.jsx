import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { signupApi, googleAuthApi } from "../api/authApi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, Rocket, Sparkles, User, UserPlus } from "lucide-react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function Signup() {
  const token = localStorage.getItem("token");
  const { theme, setTheme } = useTheme();
  const previousThemeRef = useRef(localStorage.getItem("theme") || "system");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setTheme("system");

    return () => {
      setTheme(previousThemeRef.current);
    };
  }, [setTheme]);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = formData.email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const data = await signupApi({ ...formData, email: normalizedEmail });

      if (!data?.token) {
        if (data.message && data.message.toLowerCase().includes("password")) {
          setError(data.message);
        } else {
          setError(data?.message || "Signup failed");
        }
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError("Google sign-in failed. Please try again.");
      return;
    }

    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      const data = await googleAuthApi(credentialResponse.credential);

      if (!data?.token) {
        setError(data?.message || "Google sign-in failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Server not responding");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
      <Navbar showThemeToggle={false} />

      <div className="fixed inset-0 pointer-events-none">
        <div className="blob -top-24 -left-20 h-168 w-2xl bg-primary/15" />
        <div className="blob -bottom-24 -right-20 h-160 w-160 bg-primary/10" />
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,var(--foreground)_1px,transparent_0)] bg-size-[22px_22px]" />
      </div>

      <div className="relative z-10 mx-auto mt-16 sm:mt-20 w-full max-w-4xl xl:max-w-6xl">
        <div className="overflow-hidden rounded-4xl border border-border/50 bg-card/55 backdrop-blur-3xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)]">
          <div className="grid xl:grid-cols-[0.95fr_1.05fr]">
            <section className="relative p-5 sm:p-8 lg:p-10 order-2 xl:order-1">
              <div className="mx-auto w-full max-w-md xl:max-w-104">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-muted-foreground text-center xl:text-left">Start strong</p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground text-center xl:text-left">
                  Build Your
                  <span className="text-primary"> Career Stack</span>
                </h2>
                <p className="mt-3 text-sm text-muted-foreground text-center xl:text-left">
                  Create your account in seconds, then optimize every resume for better interview conversion.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 sm:mt-8 space-y-5">
                  {error && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center">
                      {success}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                      <div className="relative group/input">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" size={18} />
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="w-full bg-secondary/30 border border-border/50 rounded-2xl pl-14 pr-6 py-4 text-foreground outline-none transition-all placeholder:text-muted-foreground/30 focus:border-primary/50 focus:bg-background focus:ring-8 focus:ring-primary/5"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                      <div className="relative group/input">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" size={18} />
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="user@domain.com"
                          inputMode="email"
                          autoComplete="email"
                          className="w-full bg-secondary/30 border border-border/50 rounded-2xl pl-14 pr-6 py-4 text-foreground outline-none transition-all placeholder:text-muted-foreground/30 focus:border-primary/50 focus:bg-background focus:ring-8 focus:ring-primary/5"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                      <div className="relative group/input">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" size={18} />
                        <input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full bg-secondary/30 border border-border/50 rounded-2xl pl-14 pr-6 py-4 text-foreground outline-none transition-all placeholder:text-muted-foreground/30 focus:border-primary/50 focus:bg-background focus:ring-8 focus:ring-primary/5"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl bg-linear-to-r from-primary to-blue-500 text-primary-foreground font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/25 hover:shadow-primary/45 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        <UserPlus size={18} strokeWidth={3} /> Sign Up <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <>
                    <div className="relative py-2">
                      <div className="h-px bg-border/60" />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-card text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                        or
                      </span>
                    </div>

                    {hasGoogleClientId ? (
                      <div className={`w-full flex justify-center ${googleLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleError}
                          text="continue_with"
                          shape="pill"
                          size="large"
                          width="320"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          disabled
                          className="w-full py-4 rounded-2xl border border-border/60 bg-secondary/30 text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] cursor-not-allowed"
                        >
                          Continue with Google
                        </button>
                        <p className="text-center text-[9px] uppercase tracking-[0.12em] text-amber-500">
                          Set VITE_GOOGLE_CLIENT_ID in client env to enable Google OAuth
                        </p>
                      </div>
                    )}
                  </>
                </form>

                <p className="mt-7 sm:mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline underline-offset-4 decoration-2">
                    Login
                  </Link>
                </p>
              </div>
            </section>

            <section className="relative hidden xl:flex min-h-176 border-l border-border/40 bg-linear-to-br from-primary/18 via-primary/8 to-transparent p-10">
              <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
              <div className="absolute -bottom-10 left-10 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/40 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em]">
                    <Rocket size={14} />
                    Fast Onboarding
                  </p>
                  <h1 className="mt-8 text-4xl sm:text-5xl font-black uppercase leading-[0.95] tracking-tight text-foreground">
                    Launch Your
                    <br />
                    Next Role
                  </h1>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/80">
                    New account, instant strategy. Get tailored resume feedback and build stronger applications from day one.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl border border-border/50 bg-background/40 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">What you unlock</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90">
                    <span className="inline-flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Smart resume insights</span>
                    <span className="inline-flex items-center gap-2"><Sparkles size={14} className="text-primary" /> ATS keyword targeting</span>
                    <span className="inline-flex items-center gap-2"><Sparkles size={14} className="text-primary" /> AI-assisted rewriting</span>
                    <span className="inline-flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Cleaner interview prep</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

