import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiMoon, FiSun, FiBell, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Settings = () => {
    // Mock state as actual theme switching is global
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';
    // const [isDarkMode, setIsDarkMode] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [browserNotifications, setBrowserNotifications] = useState(true);

    const handleSave = (setting, value) => {
        toast.success(`${setting} has been ${value ? 'enabled' : 'disabled'}`);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your application preferences.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mr-4">
                                {isDarkMode ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-0.5">
                                    Dark Mode
                                </label>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Toggle between dark and light themes.
                                </p>
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isDarkMode}
                                onChange={toggleTheme}
                            />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Settings;
