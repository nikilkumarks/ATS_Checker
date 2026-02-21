import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToggleSwitch = ({
    isOn,
    onToggle,
    label,
    description,
    icon: Icon,
    disabled = false,
    className = ""
}) => {
    return (
        <div className={`group flex items-center justify-between gap-6 py-5 px-1 rounded-2xl transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 ${className}`}>
            <div className="flex items-center gap-4">
                {Icon && (
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${isOn
                            ? 'bg-primary/20 text-primary scale-110 rotate-3'
                            : 'bg-secondary/50 text-muted-foreground group-hover:bg-secondary group-hover:text-foreground'
                        }`}>
                        <Icon size={22} strokeWidth={2.5} />
                    </div>
                )}
                <div className="flex flex-col gap-0.5">
                    {label && (
                        <span className="text-sm font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                            {label}
                        </span>
                    )}
                    {description && (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed max-w-[280px]">
                            {description}
                        </span>
                    )}
                </div>
            </div>

            <motion.button
                onClick={onToggle}
                disabled={disabled}
                whileTap={{ scale: 0.9, rotate: isOn ? -2 : 2 }}
                whileHover={{ scale: 1.05 }}
                className={`relative w-14 h-8 flex items-center rounded-full p-1.5 transition-all duration-500 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary ${isOn
                        ? 'bg-gradient-to-r from-primary to-indigo-600 shadow-lg shadow-primary/30'
                        : 'bg-secondary/80 dark:bg-zinc-800 border border-border/50'
                    } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-checked={isOn}
                role="switch"
            >
                <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-md z-10 flex items-center justify-center overflow-hidden"
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                    }}
                    animate={{
                        x: isOn ? 24 : 0
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isOn ? 'on' : 'off'}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className={`w-1 h-1 rounded-full ${isOn ? 'bg-primary' : 'bg-muted-foreground'}`} />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Particle effect simulation when ON */}
                {isOn && (
                    <motion.div
                        layoutId="glow-effect"
                        className="absolute inset-0 rounded-full bg-primary/40 blur-md -z-10"
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [0.95, 1.05, 0.95]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                )}
            </motion.button>
        </div>
    );
};

export default ToggleSwitch;
