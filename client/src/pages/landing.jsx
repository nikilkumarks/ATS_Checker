import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Smartphone,
  BarChart3,
  ShieldCheck,
  Zap, // ✅ FIXED: Added Zap import
} from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* AMBIENT BACKGROUND ELEMENTS */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob bg-primary/20 top-[-10%] left-[-10%] w-[60%] h-[60%]" />
          <div className="blob bg-indigo-600/20 bottom-[-10%] right-[-10%] w-[60%] h-[60%] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-8 animate-spring">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Step into the future of job seeking
          </div>

          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8] mb-8 animate-spring [animation-delay:100ms]">
            Build <span className="text-primary italic">ATS-Ready</span> Resumes
            <br />
            <span className="text-muted-foreground font-medium opacity-40">
              Master the Algorithm
            </span>
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed mb-12 animate-spring [animation-delay:200ms]">
            Create high-converting resumes with our AI-powered builder and
            instantly check ATS compatibility scores to guarantee you top-tier interviews.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-spring [animation-delay:400ms]">
            <Link
              to="/signup"
              className="btn-primary flex items-center justify-center gap-4 group px-10 py-5 text-sm"
            >
              Get Started Free
              <ArrowRight
                size={20}
                strokeWidth={3}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              to="/login"
              className="btn-secondary flex items-center justify-center gap-2 group px-10 py-5 text-sm"
            >
              Live Demo
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground text-sm opacity-60 animate-fade-up [animation-delay:600ms]">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} /> Fast Generation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} /> ATS Optimized
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} /> Professional Templates
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to land the job
            </h2>
            <p className="text-muted-foreground">
              Precision tools designed for modern career growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="text-primary" />,
                title: "Resume Builder",
                desc: "Intuitive interface to craft pixel-perfect resumes in minutes.",
              },
              {
                icon: <BarChart3 className="text-primary" />,
                title: "ATS Score Checker",
                desc: "Real-time analysis against complex application tracking systems.",
              },
              {
                icon: <ShieldCheck className="text-primary" />,
                title: "Data Privacy",
                desc: "Secure storage for your professional data and resume drafts.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-xl transition-all animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your career?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Join thousands of successful professionals who bypassed the automated
            rejection pile using ATS Checker.
          </p>
          <Link
            to="/signup"
            className="btn-primary inline-flex items-center gap-2 px-10"
          >
            Create Your Account Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-border mt-12 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Zap
              size={20}
              className="text-primary"
              fill="currentColor"
            />
            <span>ATS Checker</span>
          </div>

          <p className="text-muted-foreground text-sm px-10">
            &copy; {new Date().getFullYear()} ATS Checker. Built for professionals.
          </p>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
