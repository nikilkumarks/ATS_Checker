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

      // ✅ Save JWT token
      setToken(data.token);

      // 🔁 Redirect later (for now simple alert)
      alert("Login successful");

    } catch (err) {
      setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 p-8 rounded-xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-2xl font-bold text-white mb-6">
          Sign In
        </h2>

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-400">{error}</p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input mt-4"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-6 text-sm text-gray-400 text-center">
           Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
             Register
          </Link>
        </p>
      </form>
      
    </div>
  );
}
