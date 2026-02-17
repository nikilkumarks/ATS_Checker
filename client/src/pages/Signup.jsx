import { useState } from "react";
import { signupApi } from "../api/authApi";
import { Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Github } from "lucide-react";
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
            Create Your Account
          </h2>
          <p className="text-muted-foreground mt-2">
            Start building your career with AI assistance.
          </p>
        </div>

        {/* glass Card */}
        <div className="glass p-8 rounded-3xl shadow-2xl border border-border bg-card/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="input-field pl-12"
                  required
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="input-field pl-12"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
            >
              {loading ? "Creating account..." : <><UserPlus size={18} /> Get Started</>}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign up with</span></div>
            </div>

            <button type="button" className="btn-outline w-full flex items-center justify-center gap-2 py-2.5">
              <Github size={18} /> GitHub
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
              Login here
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/60 px-10">
          By signing up, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}

