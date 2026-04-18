import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle,
  Clock3,
  FileDown,
  LogIn,
  Sparkles,
  Target,
  PenTool,
  Scan,
  Upload
} from "lucide-react";

export default function Landing() {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) return;

    const root = document.documentElement;
    const previousTheme = root.classList.contains("dark") ? "dark" : "light";

    root.classList.remove("light", "dark");
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");

    return () => {
      root.classList.remove("light", "dark");
      root.classList.add(previousTheme);
      localStorage.setItem("theme", previousTheme);
    };
  }, [token]);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const stats = [
    {
      value: "75%",
      title: "Resumes Rejected",
      detail: "Resumes are rejected by bots before a human ever sees them."
    },
    {
      value: "6 Seconds",
      title: "Recruiter Attention",
      detail: "The average time a recruiter spends looking at a resume."
    },
    {
      value: "90%",
      title: "Interview Lift",
      detail: "Increase in interview chances when using ATS-optimized keywords."
    }
  ];

  const featureCards = [
    {
      icon: <PenTool size={28} />,
      title: "The Smart Builder",
      desc: "Build resumes with a Live Preview. Use 'AI Improve' to transform basic bullet points into high-impact, professional syntax instantly.",
      tone: "from-cyan-500/25 to-primary/20"
    },
    {
      icon: <Scan size={28} />,
      title: "The Precision Scanner",
      desc: "Don't apply blindly. Compare your resume against any Job Description to see your match score and identify missing critical keywords.",
      tone: "from-primary/25 to-indigo-500/20"
    },
    {
      icon: <Target size={28} />,
      title: "The Interview Navigator",
      desc: "Get custom-tailored interview questions based on your specific projects and experience. Know your 'High Value' sections at a glance.",
      tone: "from-emerald-500/25 to-cyan-500/20"
    }
  ];

  const flowSteps = [
    {
      number: "01",
      title: "Secure Login",
      detail: "Sign in instantly using Google OAuth or your account credentials."
    },
    {
      number: "02",
      title: "Build or Upload",
      detail: "Choose your starting point with builder templates or an existing resume."
    },
    {
      number: "03",
      title: "Analyze & Optimize",
      detail: "Let the Cohere-powered AI find keyword gaps and refine your content."
    },
    {
      number: "04",
      title: "Download & Apply",
      detail: "Export your ATS-ready resume in a click and apply with confidence."
    }
  ];

  const logos = ["META", "GOOGLE", "AMAZON", "NETFLIX", "MICROSOFT", "OPENAI"];

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Navbar showThemeToggle={false} />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob -top-24 -left-32 h-168 w-2xl bg-primary/15" />
        <div className="blob -bottom-20 -right-28 h-144 w-xl bg-cyan-500/15" />
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,var(--foreground)_1px,transparent_0)] bg-size-[24px_24px]" />
      </div>

      <section className="relative z-10 pt-30 pb-14 sm:pt-34 sm:pb-18 lg:pt-44 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-primary">
              <Sparkles size={14} />
              Premium AI Career Suite
            </div>

            <h1 className="mt-6 sm:mt-8 text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.9] sm:leading-[0.88] tracking-tight">
              Stop Guessing.
              <br />
              <span className="bg-linear-to-r from-primary via-blue-400 to-blue-500 bg-clip-text text-transparent">
                Start Getting Hired.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              The AI-powered career suite that optimizes your resume, predicts your ATS score, and prepares you for the interview-all in one place.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-primary to-blue-500 px-6 sm:px-8 py-4 text-[11px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.22em] text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:-translate-y-0.5"
              >
                Get Started - It's Free
                <ArrowRight size={16} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border border-border/60 bg-secondary/45 px-6 sm:px-8 py-4 text-[11px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.22em] text-foreground transition-all hover:bg-secondary/75"
              >
                Watch Demo
              </a>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Used by students on HireLenz to land roles at top tech firms.
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:max-w-xl">
              <div className="rounded-xl border border-border/60 bg-background/45 px-3 py-2">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-muted-foreground">Prediction</p>
                <p className="mt-1 text-sm font-black text-foreground">ATS Score</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/45 px-3 py-2">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-muted-foreground">Interview</p>
                <p className="mt-1 text-sm font-black text-foreground">Question Bank</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/45 px-3 py-2">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-muted-foreground">Workflow</p>
                <p className="mt-1 text-sm font-black text-foreground">One Platform</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
            <div className="rounded-4xl border border-border/60 bg-card/60 p-5 sm:p-8 backdrop-blur-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">AI Command Center</p>
              <div className="mt-4 space-y-3">
                {["Resume Optimization", "ATS Match Prediction", "Interview Readiness", "AI-Improved Content"].map((line) => (
                  <div key={line} className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground/90">
                    <CheckCircle size={15} className="text-primary" />
                    {line}
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/50 bg-background/50 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground">Response Lift</p>
                  <p className="mt-1 text-xl font-black text-foreground">+34%</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-background/50 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground">Avg Scan Speed</p>
                  <p className="mt-1 text-xl font-black text-foreground">&lt; 1s</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-border/50 bg-linear-to-r from-primary/12 to-blue-500/12 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Realtime Insight</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                  "Your resume is 82% aligned. Add cloud deployment impact metrics and Kubernetes keyword mentions for higher ranking."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 py-14 sm:py-16 animate-fade-up [animation-delay:80ms]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">The ATS Gap</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black uppercase tracking-tight">The Problem In Numbers</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {stats.map((item) => (
              <div key={item.title} className="rounded-3xl border border-border/55 bg-card/55 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/45">
                <p className="text-3xl font-black uppercase tracking-tight text-primary">{item.value}</p>
                <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-foreground">{item.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-18 sm:py-24 relative z-10 bg-linear-to-b from-transparent via-background/40 to-transparent animate-fade-up [animation-delay:120ms]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                The <span className="text-primary">Solution</span>
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Three purpose-built systems to move you from resume draft to interview-ready fast.
              </p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted-foreground">AI Suite: Active</p>
          </div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {featureCards.map((item) => (
              <div key={item.title} className="group relative overflow-hidden rounded-4xl border border-border/55 bg-card/50 p-5 sm:p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/40">
                <div className={`absolute inset-0 bg-linear-to-br ${item.tone} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/55 bg-secondary/60 text-primary transition-transform duration-500 group-hover:scale-105">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                <div className="absolute bottom-6 right-7 text-primary/35 transition-all duration-500 group-hover:translate-x-1 group-hover:text-primary">
                  <ArrowRight size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 py-18 sm:py-24 animate-fade-up [animation-delay:140ms]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">How It Works</p>
            <h3 className="mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tight">A Simple Path To Better Outcomes</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {flowSteps.map((step) => (
              <div key={step.number} className="rounded-3xl border border-border/55 bg-card/45 p-6 backdrop-blur-xl">
                <p className="text-primary text-sm font-black uppercase tracking-[0.24em]">{step.number}</p>
                <h4 className="mt-3 text-xl font-black uppercase tracking-tight">{step.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                <div className="mt-4 text-primary">
                  {step.number === "01" && <LogIn size={16} />}
                  {step.number === "02" && <Upload size={16} />}
                  {step.number === "03" && <BrainCircuit size={16} />}
                  {step.number === "04" && <FileDown size={16} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-14 sm:py-16 overflow-hidden animate-fade-up [animation-delay:160ms]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Our scanner is designed to help you beat the filters at these companies and more.
          </p>
          <div className="mt-6 sm:mt-8 overflow-hidden whitespace-nowrap rounded-3xl border border-border/55 bg-card/45 p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex animate-marquee gap-10 sm:gap-16 text-xl sm:text-3xl font-black uppercase tracking-tight text-foreground/30">
              {logos.map((brand) => (
                <span key={brand}>{brand}</span>
              ))}
              {logos.map((brand) => (
                <span key={`${brand}-dup`}>{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 relative z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-72 w-xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center animate-fade-up [animation-delay:180ms]">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.92]">
            Ready To Turn
            <span className="text-primary"> Applications Into Interviews?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Join professionals who use HireLenz to sharpen resumes, close skill gaps, and stand out in crowded hiring pipelines.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-primary to-blue-500 px-6 sm:px-8 py-4 text-[11px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.24em] text-primary-foreground shadow-2xl shadow-primary/25 transition-all hover:-translate-y-0.5"
            >
              Create Account
              <ArrowRight size={16} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border border-border/60 bg-secondary/40 px-6 sm:px-8 py-4 text-[11px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.24em] text-foreground transition-all hover:bg-secondary/70"
            >
              I Already Have An Account
            </Link>
          </div>

          <div className="mt-12 mx-auto max-w-3xl rounded-2xl border border-border/55 bg-card/45 p-4 text-left backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Pitch Angle</p>
            <p className="mt-2 text-sm text-foreground/90">
              "We didn't just build a scanner; we built a professional-grade portal. Our landing page is designed to educate the user on the ATS gap before moving them into our secure, AI-driven environment."
            </p>
          </div>
        </div>
      </section>

      <Footer isLanding />
    </div>
  );
}
