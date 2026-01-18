import { useState } from "react";
import { loginApi } from "../api/authApi";
import { setToken } from "../services/tokenService";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      if (!data.token) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      setToken(data.token);
      alert("Login successful");
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-cyan-600/20 animate-gradient" />

        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-10 right-10 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl animate-float-fast" />
      </div>

      {/* 🧊 Glass Card */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl animate-scale-in"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Sign in to access your{" "}
            <span className="text-white">ATS Resume Checker</span>, resume builder
            & job insights.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-400 animate-pulse">
            {error}
          </p>
        )}

        {/* Inputs */}
        <input
          name="email"
          type="email"
          placeholder="Email address"
          className="input transition-all duration-300 focus:ring-2 focus:ring-indigo-500/40"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input mt-4 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/40"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="relative btn-primary mt-6 w-full overflow-hidden group disabled:opacity-50"
        >
          <span className="relative z-10">
            {loading ? "Logging in..." : "Login"}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Navigation */}
        <p className="mt-6 text-sm text-gray-400 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>

        {/* Trust Footer */}
        <p className="mt-4 text-[11px] text-gray-500 text-center leading-relaxed">
          Optimized for modern ATS systems used by recruiters & hiring platforms
        </p>
      </form>
    </div>
  );
}
