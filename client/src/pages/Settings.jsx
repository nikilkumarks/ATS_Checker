import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Bell,
    ShieldCheck,
    CreditCard,
    Moon,
    Cpu,
    Layout,
    Settings as SettingsIcon,
    ChevronRight,
    Fingerprint,
    Search,
    Sparkles,
    Zap,
    Globe,
    Trash2
} from 'lucide-react';
import { useToggle } from '../context/ToggleContext';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import Navbar from '../components/Navbar';

const Settings = () => {
    const { toggles, toggleAction } = useToggle();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const sections = [
        {
            id: "personal",
            title: "App Theme",
            icon: User,
            items: [
                {
                    id: "darkMode",
                    label: "Dark Mode",
                    description: "Switch between light and dark backgrounds",
                    icon: Moon,
                },
                {
                    id: "locationAccess",
                    label: "Location",
                    description: "Help us find jobs in your current city",
                    icon: Globe,
                }
            ]
        },
        {
            id: "security",
            title: "Security",
            icon: ShieldCheck,
            items: [
                {
                    id: "biometric",
                    label: "Fingerprint Login",
                    description: "Login faster using your fingerprint",
                    icon: Fingerprint,
                },
                {
                    id: "autoPay",
                    label: "Auto Payment",
                    description: "Automatically pay for premium resume checks",
                    icon: CreditCard,
                }
            ]
        },
        {
            id: "labs",
            title: "Future Features",
            icon: Cpu,
            items: [
                {
                    id: "newDashboard",
                    label: "New Home Page",
                    description: "Try our experimental home screen layout",
                    icon: Layout,
                },
                {
                    id: "aiResumeFeature",
                    label: "AI Power Scan",
                    description: "Use deep AI to find hidden resume mistakes",
                    icon: Sparkles,
                },
                {
                    id: "betaPaymentUI",
                    label: "New Checkout",
                    description: "Help us test a faster way to pay",
                    icon: Zap,
                }
            ]
        }
    ];

    const filteredItems = sections.flatMap(s => s.items).filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
            {/* Dynamic Background Blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[140px] rounded-full animate-glow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-40">
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col md:flex-row md:items-center gap-6 mb-4"
                    >
                        <div className="p-5 bg-secondary/30 backdrop-blur-3xl rounded-[32px] border border-border/50 text-primary shadow-2xl relative group w-fit">
                            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <SettingsIcon size={32} className="relative z-10" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/30 rounded-full border border-border/50 mb-3 backdrop-blur-md">
                                <Fingerprint size={12} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Connected to Account</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-1">
                                App <span className="text-primary not-italic">Settings</span>
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 mt-3 italic">Manage your account and app preferences</p>
                        </div>
                    </motion.div>

                    {/* Premium Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative mt-12 max-w-xl group"
                    >
                        <div className="absolute -inset-1 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="SEARCH SETTINGS..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary/50 border border-border/50 rounded-3xl py-6 pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.2em] text-foreground placeholder:text-foreground/20 focus:outline-none focus:bg-secondary/70 focus:border-primary/40 transition-all backdrop-blur-3xl shadow-2xl"
                            />
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar Tabs - Desktop */}
                    <aside className="lg:col-span-3 space-y-3 hidden lg:block">
                        {[
                            { id: "all", icon: Layout, label: "Core" },
                            { id: "personal", icon: User, label: "Visuals" },
                            { id: "security", icon: ShieldCheck, label: "Security" },
                            { id: "labs", icon: Cpu, label: "Beta" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group ${activeTab === tab.id
                                    ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30 -translate-y-1 scale-[1.05]'
                                    : 'text-foreground/40 hover:bg-secondary/30 hover:text-foreground'
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-primary/10 translate-x-[-100%] ${activeTab === tab.id ? '' : 'group-hover:translate-x-[100%] shadow-2xl'} transition-transform duration-700`} />
                                <tab.icon size={16} className="relative z-10" strokeWidth={3} />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </aside>

                    {/* Settings Content */}
                    <div className="lg:col-span-9 space-y-16">
                        <AnimatePresence mode="popLayout">
                            {sections.map((section, sIdx) => {
                                const shouldShow = activeTab === "all" || activeTab === section.id;
                                const filteredSectionItems = section.items.filter(item =>
                                    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                                );

                                if (!shouldShow || (searchQuery && filteredSectionItems.length === 0)) return null;

                                return (
                                    <motion.section
                                        key={section.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5, delay: sIdx * 0.1 }}
                                        className="relative"
                                    >
                                        <div className="flex items-center gap-5 mb-8 px-4">
                                            <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                                            <h2 className="text-2xl font-black italic uppercase tracking-tight text-foreground flex items-center gap-4">
                                                <section.icon size={24} className="text-primary" strokeWidth={3} />
                                                {section.title}
                                            </h2>
                                        </div>

                                        <div className="bg-secondary/20 backdrop-blur-3xl rounded-[48px] border border-border/50 overflow-hidden shadow-2xl p-6 md:p-10 space-y-3 relative group">
                                            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />

                                            {filteredSectionItems.map((item) => (
                                                <ToggleSwitch
                                                    key={item.id}
                                                    isOn={toggles[item.id]}
                                                    onToggle={() => toggleAction(item.id)}
                                                    label={item.label}
                                                    description={item.description}
                                                    icon={item.icon}
                                                />
                                            ))}
                                        </div>
                                    </motion.section>
                                );
                            })}
                        </AnimatePresence>

                        {/* Empty State */}
                        {searchQuery && filteredItems.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 bg-secondary/20 rounded-[48px] border border-border/50 border-dashed"
                            >
                                <div className="p-8 bg-white/5 rounded-full mb-6">
                                    <Trash2 className="text-foreground/20" size={48} />
                                </div>
                                <p className="text-xs font-black text-foreground/20 uppercase tracking-[0.4em] italic">No settings found match your search</p>
                            </motion.div>
                        )}

                        {/* Support / Footer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-20 p-12 bg-secondary/30 backdrop-blur-3xl rounded-[48px] border border-border/50 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group/support"
                        >
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/support:opacity-100 transition-opacity" />
                            <div className="text-center md:text-left relative z-10">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-foreground flex items-center gap-3 justify-center md:justify-start leading-none mb-3">
                                    <Sparkles size={28} className="text-primary" /> Help & Support
                                </h3>
                                <p className="text-foreground/40 font-medium text-base italic tracking-tight">Need help with your account or the builder? Our team is here for you.</p>
                            </div>
                            <button className="whitespace-nowrap px-12 py-6 bg-primary text-primary-foreground rounded-[24px] text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-0.95 transition-all flex items-center gap-4 relative overflow-hidden group/btn">
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                <span className="relative z-10">Chat with us</span>
                                <ChevronRight size={20} strokeWidth={3} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>
                </div>

                <footer className="mt-40 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-foreground/5 italic opacity-60">
                        Version 1.0.0 // Secure Session Status: Verified
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default Settings;
