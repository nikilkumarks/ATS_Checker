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
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 p-8 rounded-xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-2xl font-bold text-white mb-6">
          Create Account
        </h2>

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-400">{error}</p>
        )}

        {/* Success */}
        {success && (
          <p className="mb-4 text-sm text-green-400">{success}</p>
        )}

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="input"
          required
        />

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="input mt-4"
          required
        />

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="input mt-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:opacity-50"
        >
          {loading ? "Creating..." : "Get Started"}
        </button>
      <p className="mt-6 text-sm text-gray-400 text-center">
               Already have an account?{" "}
       <Link
       to="/login"
       className="text-blue-400 hover:underline"
       >
        Login
       </Link>
      </p>        
      </form>


    </div>
  );
}
