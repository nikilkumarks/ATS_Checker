import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

const ToggleContext = createContext();

export const ToggleProvider = ({ children }) => {
    const { theme, toggleTheme } = useTheme();

    // Initial state derived from localStorage or defaults
    const [toggles, setToggles] = useState(() => {
        const saved = localStorage.getItem('app-settings');
        const defaultSettings = {
            notifications: true,
            biometric: false,
            autoPay: false,
            newDashboard: false,
            betaPaymentUI: false,
            aiResumeFeature: true,
            locationAccess: false,
            dataAnalytics: true,
        };

        const settings = saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        return settings;
    });

    // Special handling for darkMode toggle being in sync with ThemeContext
    const darkMode = theme === 'dark';

    // Sync with localStorage whenever toggles change
    useEffect(() => {
        localStorage.setItem('app-settings', JSON.stringify(toggles));

        // MOCK BACKEND SYNC (Phase 7)
        const syncWithBackend = async () => {
            console.log('🔄 Syncing with backend...', toggles);
            // Simulate API call
            // await fetch('/api/user/settings', { method: 'PUT', body: JSON.stringify(toggles) });
        };

        const debounceTimer = setTimeout(syncWithBackend, 1000);
        return () => clearTimeout(debounceTimer);
    }, [toggles]);

    const toggleAction = (key) => {
        if (key === 'darkMode') {
            toggleTheme();
        } else {
            setToggles(prev => ({
                ...prev,
                [key]: !prev[key]
            }));
        }
    };

    const setToggleValue = (key, value) => {
        setToggles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <ToggleContext.Provider value={{ toggles: { ...toggles, darkMode }, toggleAction, setToggleValue }}>
            {children}
        </ToggleContext.Provider>
    );
};

export const useToggle = () => {
    const context = useContext(ToggleContext);
    if (!context) {
        throw new Error('useToggle must be used within a ToggleProvider');
    }
    return context;
};
