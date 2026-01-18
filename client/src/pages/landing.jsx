import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-[#0e0e10] text-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 text-center px-6">
        <h1 className="text-5xl font-bold mb-4">
          Build ATS-Friendly Resumes
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Create professional resumes, check ATS score, and land more interviews.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white/10"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mt-24 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {[
          "Resume Builder",
          "ATS Score Checker",
          "Job Matching",
        ].map((item) => (
          <div
            key={item}
            className="bg-white/5 p-6 rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-2">{item}</h3>
            <p className="text-gray-400">
              Smart tools designed to improve your hiring success.
            </p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-24 text-center pb-20">
        <h2 className="text-3xl font-bold mb-4">
          Start Building Your Resume Today
        </h2>
        <Link
          to="/signup"
          className="inline-block mt-4 bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
}
