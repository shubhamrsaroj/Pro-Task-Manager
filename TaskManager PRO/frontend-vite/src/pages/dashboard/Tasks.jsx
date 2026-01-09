import { useState, useEffect } from 'react';
import api from '../../lib/api';
import CreateTaskModal from '../../components/CreateTaskModal';
import { isAdmin } from '../../lib/permissions';
import { FiPlus, FiSearch, FiFilter, FiCalendar, FiUser } from 'react-icons/fi';

const Tasks = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
    });
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);

            const response = await api.get(`/tasks?${params.toString()}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch and fetch on filter change
    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const handleTaskCreated = () => {
        // Refresh list after creation
        fetchTasks();
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-400 border-red-400/30';
            case 'medium': return 'text-orange-400 border-orange-400/30';
            case 'low': return 'text-green-400 border-green-400/30';
            default: return 'text-slate-400 border-slate-400/30';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'in-progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'todo': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Tasks</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track your team's tasks</p>
                </div>
                {isAdmin() && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                        <FiPlus className="mr-2" />
                        New Task
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm transition-colors">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 md:max-w-[200px] transition-colors"
                    >
                        <option value="">All Statuses</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 md:max-w-[200px] transition-colors"
                    >
                        <option value="">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                </div>
            </div>

            {/* Task List */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden transition-colors">
                {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : tasks?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-full mb-4">
                            <FiFilter className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-900 dark:text-slate-300 font-medium text-lg">No tasks found</p>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium text-sm uppercase border-b border-slate-200 dark:border-slate-700/50">
                                <tr>
                                    <th className="px-6 py-4">Task Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Priority</th>
                                    <th className="px-6 py-4">Assignee</th>
                                    <th className="px-6 py-4">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {tasks?.map((task) => (
                                    <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 max-w-sm">
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                                    {task.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)} capitalize`}>
                                                {task.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)} capitalize`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold">
                                                    {task.assignedTo?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                                    {task.assignedTo?.name || 'Unassigned'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center text-sm ${new Date(task.dueDate) < new Date() ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                                <FiCalendar className="mr-2" />
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onTaskCreated={handleTaskCreated}
            />
        </div>
    );
};

export default Tasks;
