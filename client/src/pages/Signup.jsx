import { useState } from "react";
import { signupApi } from "../api/authApi";
import { Link } from "react-router-dom";

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
    <div className="relative min-h-screen overflow-hidden bg-[#0e0e10] flex items-center justify-center px-4">
      
      {/* 🌌 Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-indigo-600/10 to-purple-600/20 animate-gradient" />

        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-10 right-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-float-fast" />
      </div>

      {/* 🧊 Glass Card */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl animate-scale-in"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Build ATS-optimized resumes, check scores, and get{" "}
            <span className="text-white">job-ready insights</span>.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-400 animate-pulse">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="mb-4 text-sm text-green-400 animate-pulse">
            {success}
          </p>
        )}

        {/* Inputs */}
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full name"
          className="input transition-all duration-300 focus:ring-2 focus:ring-emerald-500/40"
          required
        />

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          className="input mt-4 transition-all duration-300 focus:ring-2 focus:ring-emerald-500/40"
          required
        />

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          className="input mt-4 transition-all duration-300 focus:ring-2 focus:ring-emerald-500/40"
          required
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="relative btn-primary mt-6 w-full overflow-hidden group disabled:opacity-50"
        >
          <span className="relative z-10">
            {loading ? "Creating..." : "Get Started"}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Navigation */}
        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:underline"
          >
            Login
          </Link>
        </p>

        {/* Trust Footer */}
        <p className="mt-4 text-[11px] text-gray-500 text-center leading-relaxed">
          Designed for modern ATS platforms used by recruiters worldwide
        </p>
      </form>
    </div>
  );
}
