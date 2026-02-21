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
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-40">
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="p-4 bg-primary/10 rounded-[28px] border border-primary/20 text-primary">
                            <SettingsIcon size={32} />
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.8]">
                                Control <span className="text-primary">Center</span>
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-2 opacity-60">System Configuration & User Preferences</p>
                        </div>
                    </motion.div>

                    {/* Premium Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative mt-10 max-w-xl"
                    >
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH SETTINGS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all backdrop-blur-md"
                        />
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar Tabs - Desktop */}
                    <aside className="lg:col-span-3 space-y-2 hidden lg:block">
                        {["all", "personal", "security", "labs"].map((id) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.05]'
                                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                    }`}
                            >
                                {id === 'all' && <Layout size={14} />}
                                {id === 'personal' && <User size={14} />}
                                {id === 'security' && <ShieldCheck size={14} />}
                                {id === 'labs' && <Cpu size={14} />}
                                {id}
                            </button>
                        ))}
                    </aside>

                    {/* Settings Content */}
                    <div className="lg:col-span-9 space-y-12">
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
                                        transition={{ delay: sIdx * 0.1 }}
                                        className="relative"
                                    >
                                        <div className="flex items-center gap-4 mb-6 px-2">
                                            <div className="w-1 h-6 bg-primary rounded-full" />
                                            <h2 className="text-xl font-black italic uppercase tracking-tight text-foreground/80 flex items-center gap-3">
                                                <section.icon size={20} className="text-primary" />
                                                {section.title}
                                            </h2>
                                        </div>

                                        <div className="bg-card/30 backdrop-blur-xl rounded-[40px] border border-border/50 overflow-hidden shadow-2xl p-4 md:p-8 space-y-2">
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
                                className="flex flex-col items-center justify-center py-20 bg-secondary/20 rounded-[40px] border border-border border-dashed"
                            >
                                <Trash2 className="text-muted-foreground mb-4" size={48} />
                                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No matching protocols found</p>
                            </motion.div>
                        )}

                        {/* Danger Zone / Footer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-20 p-10 bg-gradient-to-br from-primary/5 to-indigo-600/5 rounded-[40px] border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8"
                        >
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black italic uppercase tracking-tight text-primary flex items-center gap-2 justify-center md:justify-start">
                                    <Sparkles size={24} /> Customer Help
                                </h3>
                                <p className="text-muted-foreground font-medium text-sm mt-2">Need help with your settings? We are online.</p>
                            </div>
                            <button className="whitespace-nowrap px-10 py-5 bg-primary text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-3">
                                Chat with us
                                <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    </div>
                </div>

                <footer className="mt-40 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] text-muted-foreground opacity-30 italic">
                        ATS Checker Enterprise OS v4.1.2 - All Rights Reserved
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default Settings;
