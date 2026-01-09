import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiTrendingUp, FiUsers, FiClock, FiActivity, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
        </p>
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Navbar */}
            <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">TM</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                                TaskManager Pro
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            {isAuthenticated ? (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all transform hover:-translate-y-0.5"
                                >
                                    Go to Dashboard
                                </button>
                            ) : (
                                <div className="space-x-4">
                                    <button
                                        onClick={() => navigate('/auth/login')}
                                        className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => navigate('/auth/register')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 hidden sm:inline-block"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm">
                        🚀 Version 2.0 is better than ever
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
                        Manage tasks with <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            unmatched efficiency
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-10">
                        Stop juggling multiple apps. TaskManager Pro unifies your tasks, team, and analytics into one powerful, intuitive platform.
                    </p>
                    <div className="flex justify-center flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/register')}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/25 flex items-center justify-center"
                        >
                            Start for Free <FiArrowRight className="ml-2" />
                        </button>
                        <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white text-lg px-8 py-4 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-center">
                            View Demo
                        </button>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-40 dark:opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to succeed</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">Powerful features designed for modern teams</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={FiCheckCircle}
                            title="Smart Task Tracking"
                            description="Create, organize, and prioritize tasks with ease. Drag and drop interface for seamless workflow management."
                        />
                        <FeatureCard
                            icon={FiUsers}
                            title="Team Collaboration"
                            description="Assign tasks, share updates, and communicate with your team in real-time. Keep everyone aligned."
                        />
                        <FeatureCard
                            icon={FiTrendingUp}
                            title="Advanced Analytics"
                            description="Gain insights into team performance with visual reports. Track velocity, completion rates, and more."
                        />
                        <FeatureCard
                            icon={FiShield}
                            title="Role-Based Security"
                            description="Granular permission controls ensure team members only access what they need. Secure and compliant."
                        />
                        <FeatureCard
                            icon={FiClock}
                            title="Real-time Updates"
                            description="Stay in sync with instant notifications and live updates. Never miss a deadline again."
                        />
                        <FeatureCard
                            icon={FiActivity}
                            title="Workflow Automation"
                            description="Automate repetitive tasks and streamline your processes. Focus on what matters most."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">TM</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">TaskManager Pro</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} TaskManager Pro. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
