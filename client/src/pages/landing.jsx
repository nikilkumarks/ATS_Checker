import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative bg-[#0e0e10] text-white min-h-screen overflow-hidden">
      <Navbar />

      {/* 🌌 Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-cyan-600/20 animate-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-float-fast" />
      </div>

      {/* 🚀 HERO */}
      <section className="pt-36 pb-28 text-center px-6 animate-fade-up">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Build{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            ATS-Friendly
          </span>{" "}
          Resumes That Get Interviews
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Create professional resumes, analyze ATS scores, and match with the
          right jobs — all in one powerful career platform.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link
            to="/signup"
            className="relative px-8 py-4 rounded-xl text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            Get Started Free
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 rounded-xl text-lg border border-white/20 hover:bg-white/10 transition"
          >
            Sign In
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Trusted by job seekers optimizing resumes for modern ATS systems
        </p>
      </section>

      {/* ✨ FEATURES */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Smart Resume Builder",
            desc: "Build clean, recruiter-approved resumes using guided templates."
          },
          {
            title: "ATS Score Checker",
            desc: "Instantly see how well your resume matches job descriptions."
          },
          {
            title: "AI Job Matching",
            desc: "Find roles aligned with your skills, experience, and resume strength."
          },
        ].map((item, index) => (
          <div
            key={item.title}
            className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <h3 className="text-xl font-semibold mb-3">
              {item.title}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* 🎯 CTA */}
      <section className="mt-32 pb-28 text-center px-6 animate-fade-up">
        <h2 className="text-4xl font-bold mb-6">
          Your Resume Is Your First Interview
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto">
          Optimize it for ATS, stand out to recruiters, and increase your
          shortlisting chances.
        </p>

        <Link
          to="/signup"
          className="inline-block mt-10 px-10 py-4 rounded-xl text-lg font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 hover:-translate-y-1 hover:shadow-xl transition-all"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
}
