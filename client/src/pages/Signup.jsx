import { useState } from "react";
import { signupApi } from "../api/authApi";
import { Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await signupApi(formData);

      if (data.message && data.message.toLowerCase().includes("password")) {
        setError(data.message);
      } else {
        setSuccess(data.message || "Signup successful");
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-background text-foreground overflow-hidden">
      <Navbar />

      {/* AMBIENT BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10" />
        <div className="blob bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] dark:opacity-[0.03] pointer-events-none" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 transition-transform hover:scale-105">
            <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20 -rotate-3">
              <UserPlus size={28} fill="currentColor" className="text-primary-foreground" />
            </div>
            <span className="text-4xl font-black italic tracking-tighter uppercase text-foreground">
              ATS <span className="text-primary">Checker</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground/90">
            Create <span className="text-primary">Account</span>
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black mt-2 opacity-60">
            Join thousands of professionals today
          </p>
          Broadway
          Broadway
        </div>

        {/* glass Card */}
        <div className="bg-card/50 backdrop-blur-3xl p-10 rounded-[40px] shadow-2xl border border-border/50 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
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
              className={`w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus size={18} strokeWidth={3} /> Sign Up</>
              )}
            </button>

          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline underline-offset-4 decoration-2">
              Login
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 px-10">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

