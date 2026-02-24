import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  BarChart3,
  ShieldCheck,
  Zap,
  PenTool,
  Scan,
  Globe,
  Star
} from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Navbar />

      {/* AMBIENT BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/15" />
        <div className="blob bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] dark:opacity-[0.04] pointer-events-none" />
      </div>


      {/* HERO SECTION */}
      <section className="relative pt-40 pb-32 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-foreground/5 border border-foreground/10 text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-10 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Career Tools
          </div>

          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-10 animate-fade-up [animation-delay:100ms]">
            Get <span className="text-primary not-italic">Hired</span>
            <br />
            <span className="text-foreground/10 dark:text-foreground/20">Faster</span>
          </h1>


          <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed mb-16 animate-fade-up [animation-delay:200ms]">
            Build professional resumes that beat automated filters.
            Instantly check your score and get more interviews with our smart scanner.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-up [animation-delay:300ms]">
            <Link
              to="/signup"
              className="group relative px-10 py-5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4"
            >
              Get Started Now
              <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>

            <Link
              to="/login"
              className="px-10 py-5 border border-border/50 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-xl text-foreground font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-3"
            >
              Member Login
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 dark:opacity-40 animate-fade-up [animation-delay:400ms]">
            {[
              { label: "Happy Users", val: "12.4k+" },
              { label: "Success Rate", val: "98.2%" },
              { label: "Scan Time", val: " < 1s" },
              { label: "Top Ratings", val: "5 Stars" }
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl font-black text-foreground">{stat.val}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold mt-1 text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="py-32 relative z-10 bg-gradient-to-b from-transparent via-background to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 animate-fade-up">
            <div className="text-left">
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
                Key <span className="text-primary italic">Features</span>
              </h2>
              <p className="text-muted-foreground max-w-md font-medium">
                Modern tools designed to help you land your dream job faster.
              </p>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 pb-2"> Status: Active </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <PenTool size={32} />,
                title: "Resume Builder",
                desc: "Build high-quality resumes instantly with proven professional templates.",
                color: "from-primary/20 to-indigo-600/20"
              },
              {
                icon: <Scan size={32} />,
                title: "ATS Scanner",
                desc: "Check your resume against automated filters to find and fix potential issues.",
                color: "from-blue-600/20 to-cyan-500/20"
              },
              {
                icon: <ShieldCheck size={32} />,
                title: "Secure Data",
                desc: "Your personal information is safe and encrypted with our secure platform.",
                color: "from-emerald-600/20 to-teal-500/20"
              }
            ].map((item, index) => (
              <div
                key={item.title}
                className="group relative p-10 rounded-[40px] glass hover:border-primary/40 transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-700`} />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-primary border border-border/50">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute bottom-6 right-8 text-primary opacity-20 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-100">
                  <ArrowRight size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TRUST */}
      <section className="py-20 z-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 whitespace-nowrap overflow-hidden">
          <div className="flex animate-marquee gap-20 opacity-20 items-center">
            {["GOOGLE", "META", "AMAZON", "NETFLIX", "APPLE", "SPACEX", "OPENAI", "COHERE"].map(brand => (
              <span key={brand} className="text-4xl font-black italic tracking-tighter">{brand}</span>
            ))}
            {/* Duplicate for seamless loop */}
            {["GOOGLE", "META", "AMAZON", "NETFLIX", "APPLE", "SPACEX", "OPENAI", "COHERE"].map(brand => (
              <span key={brand + "_2"} className="text-4xl font-black italic tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 relative z-10 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[150px] rounded-full opacity-30" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-10 leading-none">
            Ready to <span className="text-primary">Start?</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-medium mb-16 opacity-70">
            Join thousands of professionals who have already improved their careers.
            Start getting the interviews you deserve today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-4 px-12 py-6 bg-foreground text-background font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-foreground/10 active:scale-95 group"
          >
            Start Now <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-border/50 relative z-10 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform group mb-6">
                <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20 rotate-3">
                  <Zap size={22} fill="currentColor" className="text-primary-foreground" />
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase italic leading-none">
                  ATS <span className="text-primary">Checker</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xs opacity-50">
                Professional tools for the modern job seeker. Simple, fast, and effective.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Features</h4>
              <div className="flex flex-col gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                <Link to="/resume-builder" className="hover:text-primary transition-colors">Builder</Link>
                <Link to="/ats-scanner" className="hover:text-primary transition-colors">Scanner</Link>
                <Link to="/settings" className="hover:text-primary transition-colors">Settings</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Company</h4>
              <div className="flex flex-col gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                <a href="#" className="hover:text-primary transition-colors">About Us</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
                <a href="#" className="hover:text-primary transition-colors">Support</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-border/50 gap-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
              &copy; {new Date().getFullYear()} ATS Checker. All rights reserved.
            </p>

            <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
