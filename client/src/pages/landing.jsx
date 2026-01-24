import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-[#0e0e10] text-white min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="pt-36 pb-24 text-center px-6 animate-fade-up">
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-6">
          Build <span className="text-blue-500">ATS-Friendly</span> Resumes
          <br className="hidden md:block" />
          That Get Interviews
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Create professional resumes, check ATS compatibility, and improve
          your chances of getting shortlisted — all in one platform.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-lg text-lg font-medium bg-blue-600 hover:bg-blue-500 transition"
          >
            Get Started Free
          </Link>

          {/* <Link
            to="/login"
            className="px-8 py-4 rounded-lg text-lg border border-white/20 hover:bg-white/5 transition"
          >
            Sign In
          </Link> */}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Used by job seekers preparing resumes for modern ATS systems
        </p>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {[
          {
            title: "Resume Builder",
            desc: "Create clean, structured resumes that recruiters actually read."
          },
          {
            title: "ATS Score Checker",
            desc: "Understand how your resume performs against ATS filters."
          },
          {
            title: "Job Matching",
            desc: "Find roles that align with your skills and resume strength."
          },
        ].map((item, index) => (
          <div
            key={item.title}
            className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-blue-500/40 transition animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <h3 className="text-xl font-medium mb-3">
              {item.title}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-28 pb-24 text-center px-6 animate-fade-up">
        <h2 className="text-4xl font-semibold mb-4">
          Your Resume Is Your First Interview
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto">
          Make sure it passes ATS checks and reaches recruiters.
        </p>

        <Link
          to="/signup"
          className="inline-block mt-8 px-10 py-4 rounded-lg text-lg font-medium bg-blue-600 hover:bg-blue-500 transition"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
}
