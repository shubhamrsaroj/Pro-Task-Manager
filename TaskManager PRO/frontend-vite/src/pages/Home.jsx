import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiRepeat, FiShield, FiPieChart, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const features = [
        {
            title: 'Role-Based Access',
            description: 'Secure your workflow with granular permissions for Admins, Managers, and Employees.',
            icon: FiShield,
            gradient: "from-red-400 to-pink-400"
        },
        {
            title: 'Team Sync',
            description: 'Collaborate seamlessly with real-time updates and task assignments.',
            icon: FiUsers,
            gradient: "from-teal-400 to-green-400"
        },
        {
            title: 'Analytics & Insights',
            description: 'Visualize productivity with detailed interactive charts and reports.',
            icon: FiPieChart,
            gradient: "from-cyan-400 to-blue-400"
        },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-radial from-purple-900/40 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto pt-20 pb-32 px-4 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-24">
                    <div className="px-4 py-1 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
                        <span className="text-sm font-medium text-purple-200">
                            ✨ The Ultimate Task Management Solution
                        </span>
                    </div>

                    <div className="max-w-4xl space-y-6 mb-10">
                        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Manage tasks with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                Unmatched Precision
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                            TaskManager PRO streamlines your team's workflow with powerful automation,
                            real-time collaboration, and insightful analytics.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => navigate('/auth/register')}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3.5 px-8 rounded-lg shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all transform hover:-translate-y-0.5"
                        >
                            Get Started Free
                            <FiArrowRight className="ml-2" />
                        </button>
                        <button
                            onClick={() => navigate('/auth/login')}
                            className="bg-transparent border border-white/20 hover:bg-white/10 text-white font-semibold py-3.5 px-8 rounded-lg transition-all"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 group"
                        >
                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
