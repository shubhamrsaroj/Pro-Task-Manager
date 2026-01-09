import {
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiLayers,
    FiTrendingUp,
    FiTrendingDown
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../../lib/api';

const StatCard = ({ label, value, icon: Icon, colorClass, helpText, trend }) => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm overflow-hidden text-center sm:text-left transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${colorClass} mt-4 sm:mt-0`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        {helpText && (
            <div className="flex items-center justify-center sm:justify-start text-xs font-medium">
                <span className={`flex items-center mr-2 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
                    {trend === 'up' && <FiTrendingUp className="mr-1" />}
                    {trend === 'down' && <FiTrendingDown className="mr-1" />}
                    {helpText}
                </span>
                <span className="text-slate-400 dark:text-slate-500">vs last month</span>
            </div>
        )}
    </div>
);

const Analytics = () => {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Calculate stats client-side from valid tasks
                // Note: ideally this should be a dedicated stats endpoint
                const response = await api.get('/tasks');
                const tasks = response.data;

                const total = tasks.length;
                const completed = tasks.filter(t => t.status === 'completed').length;
                const inProgress = tasks.filter(t => t.status === 'in-progress').length;
                const overdue = tasks.filter(t => {
                    return t.status !== 'completed' && new Date(t.dueDate) < new Date();
                }).length;

                setStats({ total, completed, inProgress, overdue });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Analytics & Reports</h1>
                <p className="text-slate-500 dark:text-slate-400">Overview of task performance and status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Tasks"
                    value={stats.total}
                    icon={FiLayers}
                    colorClass="bg-indigo-500"
                    helpText="Total tasks created"
                />
                <StatCard
                    label="Completed"
                    value={stats.completed}
                    icon={FiCheckCircle}
                    colorClass="bg-green-500"
                    helpText={`${stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}% completion`}
                    trend="up"
                />
                <StatCard
                    label="In Progress"
                    value={stats.inProgress}
                    icon={FiClock}
                    colorClass="bg-orange-500"
                    helpText="Active workflows"
                />
                <StatCard
                    label="Overdue"
                    value={stats.overdue}
                    icon={FiAlertCircle}
                    colorClass="bg-red-500"
                    helpText="Action required"
                    trend="decrease"
                />
            </div>

            {/* Placeholder for potential Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 h-80 flex items-center justify-center transition-colors">
                    <div className="text-center">
                        <div className="bg-slate-100 dark:bg-slate-700 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <FiLayers className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">Task Velocity Chart (Coming Soon)</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 h-80 flex items-center justify-center transition-colors">
                    <div className="text-center">
                        <div className="bg-slate-100 dark:bg-slate-700 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <FiCheckCircle className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">Completion Rate Chart (Coming Soon)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
