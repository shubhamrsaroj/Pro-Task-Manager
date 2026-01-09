import { useState, useEffect } from 'react';
import api from '../../lib/api';
import {
    FiFileText,
    FiCheckCircle,
    FiBarChart2,
    FiClock,
    FiAlertTriangle,
    FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, colorClass, isLoading, helpText }) => {
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden p-6 transition-all hover:border-blue-400 dark:hover:border-slate-600">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                        {title}
                    </p>
                    {isLoading ? (
                        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    ) : (
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            {helpText && (
                <p className="text-xs text-slate-500">
                    {helpText}
                </p>
            )}
        </div>
    );
};

export default function DashboardHome() {
    const { user } = useAuth();
    const userData = user || { name: 'User' };

    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/tasks/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoadingStats(false);
            }
        };

        const fetchRecentTasks = async () => {
            try {
                const response = await api.get('/tasks', {
                    params: { limit: 5, sortBy: 'createdAt', sortOrder: 'desc' },
                });
                setRecentTasks(response.data);
            } catch (error) {
                console.error('Failed to fetch recent tasks:', error);
            } finally {
                setLoadingTasks(false);
            }
        };

        fetchStats();
        fetchRecentTasks();
    }, []);

    const calculateCompletion = () => {
        if (!stats?.statusCounts) return 0;
        const { completed = 0, 'in-progress': inProgress = 0, todo = 0 } = stats.statusCounts;
        const total = completed + inProgress + todo;
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    };

    const completionRate = calculateCompletion();

    const getStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-500/10 text-green-400 border-green-500/20',
            'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            todo: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        };
        return colors[status] || 'bg-slate-500/10 text-slate-400';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            high: 'text-red-400 border-red-400/30',
            medium: 'text-orange-400 border-orange-400/30',
            low: 'text-green-400 border-green-400/30'
        };
        return colors[priority] || 'text-slate-400 border-slate-400/30';
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 overflow-hidden shadow-lg animate-fade-in-up">
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 bg-gradient-to-l from-white to-transparent transform skew-x-12" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userData.name}!</h1>
                        <p className="text-blue-100 text-lg">
                            Here's what's happening with your projects today.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl min-w-[200px] border border-white/20">
                        <div className="flex justify-between mb-2 text-white">
                            <span className="font-medium">Progress</span>
                            <span className="font-bold">{completionRate}%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2.5">
                            <div
                                className="bg-white h-2.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                style={{ width: `${completionRate}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Tasks"
                    value={(stats?.statusCounts?.completed || 0) + (stats?.statusCounts?.['in-progress'] || 0) + (stats?.statusCounts?.todo || 0)}
                    icon={FiFileText}
                    colorClass="bg-indigo-500"
                    isLoading={loadingStats}
                    helpText="All active tasks"
                />
                <StatCard
                    title="Completed"
                    value={stats?.statusCounts?.completed || 0}
                    icon={FiCheckCircle}
                    colorClass="bg-green-500"
                    isLoading={loadingStats}
                    helpText="+12% from last week"
                />
                <StatCard
                    title="In Progress"
                    value={stats?.statusCounts?.['in-progress'] || 0}
                    icon={FiClock}
                    colorClass="bg-blue-500"
                    isLoading={loadingStats}
                    helpText="Active tasks"
                />
                <StatCard
                    title="Overdue"
                    value={stats?.overdueCount || 0}
                    icon={FiAlertTriangle}
                    colorClass="bg-red-500"
                    isLoading={loadingStats}
                    helpText="Action required"
                />
            </div>

            {/* Recent Tasks */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                            <FiTrendingUp className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loadingTasks ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-10 bg-slate-700/50 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium text-sm uppercase border-b border-slate-200 dark:border-slate-700/50">
                                <tr>
                                    <th className="px-6 py-4">Task</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Priority</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {recentTasks?.map((task) => (
                                    <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{task.title}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                                    {task.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)} capitalize`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)} capitalize`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {!recentTasks?.length && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            No recent tasks found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
