import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="text-emerald-500" size={18} />,
        error: <AlertCircle className="text-red-500" size={18} />,
        info: <Info className="text-primary" size={18} />,
    };

    const colors = {
        success: 'border-emerald-500/20 bg-emerald-500/5',
        error: 'border-red-500/20 bg-red-500/5',
        info: 'border-primary/20 bg-primary/5',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-6 py-4 rounded-[24px] border backdrop-blur-3xl shadow-2xl min-w-[300px] max-w-[90vw] ${colors[type]}`}
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-[11px] font-black uppercase tracking-widest text-foreground/90 flex-1 leading-relaxed">
                {message}
            </p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-white/5 rounded-full transition-colors text-muted-foreground/50 hover:text-foreground"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
};

export default Toast;
