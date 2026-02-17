import { useState } from "react";
import { loginApi } from "../api/authApi";
import { setToken } from "../services/tokenService";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Github } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi(formData);

      if (!data?.token) {
        setError(data?.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-background transition-colors duration-300">
      <Navbar />

      {/* AMBIENT BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob bg-primary/20 top-[-10%] left-[-10%] w-[60%] h-[60%]" />
        <div className="blob bg-indigo-600/20 bottom-[-10%] right-[-10%] w-[60%] h-[60%] animate-pulse" />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-3xl font-black italic tracking-tighter uppercase text-foreground mb-4">
            ATS <span className="text-primary">Checker</span>
          </Link>
          <h2 className="text-2xl font-bold text-foreground">
            Welcome Back
          </h2>
          <p className="text-muted-foreground mt-2">
            Continue your journey to a dream job.
          </p>
        </div>

        {/* glass Card */}
        <div className="glass p-8 rounded-2xl shadow-2xl border border-border bg-card/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="input-field pl-12"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="input-field pl-12"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : <><LogIn size={18} /> Sign In</>}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
            </div>

            <button type="button" className="btn-outline w-full flex items-center justify-center gap-2 py-2.5">
              <Github size={18} /> GitHub
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
              Create one for free
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/60 px-10">
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}

