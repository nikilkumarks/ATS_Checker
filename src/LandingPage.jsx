import React from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaMagic, FaRocket } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-inter scroll-smooth">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-[#21262d] bg-[#0d1117]/60 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-xl font-bold tracking-tight">
          ATS<span className="text-indigo-500">Check</span>
        </h1>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how" className="hover:text-white transition">How it Works</a>
          <a href="#cta" className="hover:text-white transition">Upload</a>
        </nav>
        <button className="bg-white text-black px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition">
          Sign In
        </button>
      </header>

      {/* Hero */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-20 gap-12">
        <motion.div
          className="max-w-2xl space-y-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Build a Resume That <span className="text-indigo-400">Beats the Bots</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Our AI-powered ATS checker gives instant feedback on formatting, keywords, and compliance to help you land interviews.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-indigo-500/30">
              🚀 Get started
            </button>
            <button className="border border-gray-500 px-6 py-3 rounded-lg text-gray-300 hover:border-white transition">
              See a Sample Report
            </button>
          </div>
        </motion.div>

        <motion.div
          className="w-full md:w-[500px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="https://undraw.co/api/illustrations/ff9c3f89-4cbf-496b-86d4-4a8e4b763a12"
            alt="ATS UI"
            className="rounded-xl border border-gray-800 shadow-xl hover:shadow-indigo-400/40 transition duration-300"
          />
        </motion.div>
      </section>

      {/* Features */}
      <motion.section
        id="features"
        className="px-6 md:px-20 py-20 bg-[#161b22] border-y border-[#21262d]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-semibold text-center mb-12 text-white">
          Why Use <span className="text-indigo-400">ATSCheck</span>?
        </h3>
        <div className="grid md:grid-cols-3 gap-10 text-gray-300">
          {[{
            icon: <FaFileAlt className="text-4xl text-indigo-500 mb-4" />,
            title: "ATS Score Analysis",
            desc: "Check how your resume performs across Applicant Tracking Systems used by top companies."
          }, {
            icon: <FaMagic className="text-4xl text-indigo-500 mb-4" />,
            title: "Keyword Matcher",
            desc: "Matches skills and terms from job descriptions to suggest what to add or highlight."
          }, {
            icon: <FaRocket className="text-4xl text-indigo-500 mb-4" />,
            title: "Instant Feedback",
            desc: "Upload and receive a detailed PDF report instantly with improvement suggestions."
          }].map((f, i) => (
            <motion.div
              key={i}
              className="bg-[#0d1117]/70 p-6 rounded-xl border border-gray-700 backdrop-blur-md shadow hover:shadow-lg hover:border-indigo-500 transition-all"
              whileHover={{ y: -4 }}
            >
              {f.icon}
              <h4 className="text-lg font-semibold mb-2">{f.title}</h4>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section
        id="how"
        className="px-6 md:px-20 py-20 bg-[#0d1117]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-semibold text-center mb-12">How It Works</h3>
        <ol className="space-y-6 max-w-3xl mx-auto text-gray-400 text-lg list-decimal list-inside">
          <li>Upload your resume (PDF/DOC format).</li>
          <li>Paste or upload a job description you're targeting.</li>
          <li>Get an ATS score, keyword matches, and actionable tips.</li>
          <li>Download your full ATS optimization report as a PDF.</li>
        </ol>
      </motion.section>

      {/* CTA */}
      <motion.section
        id="cta"
        className="text-center px-6 md:px-20 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-semibold mb-4">Want Your Resume to Pass?</h3>
        <p className="text-gray-400 mb-6">
          Get your ATS score, keyword gaps, and improvement tips – instantly.
        </p>
        <button className="bg-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition shadow-md hover:shadow-indigo-400/40">
          Upload Resume
        </button>
      </motion.section>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center py-10 border-t border-[#21262d] px-4">
        © 2025 ATSCheck. Crafted with ❤️ using React + Tailwind.
      </footer>
    </div>
  );
};

export default LandingPage;
