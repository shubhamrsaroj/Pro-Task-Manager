import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
    const [users, setUsers] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (isOpen) {
            const fetchUsers = async () => {
                try {
                    const response = await api.get('/users');
                    setUsers(response.data);
                } catch (error) {
                    console.error('Failed to fetch users for task creation:', error);
                }
            };
            fetchUsers();
        }
    }, [isOpen]);

    const onSubmit = async (data) => {
        try {
            await api.post('/tasks', data);
            toast.success('Task created successfully');
            reset();
            onClose();
            if (onTaskCreated) {
                onTaskCreated();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to create task');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-800 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl transform transition-all scale-100">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Create New Task</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Title</label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            placeholder="Task title"
                            className={`w-full bg-slate-900 border ${errors.title ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                        />
                        {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Description</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            placeholder="Task description"
                            rows={3}
                            className={`w-full bg-slate-900 border ${errors.description ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                        />
                        {errors.description && <p className="text-red-400 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Priority</label>
                            <select
                                {...register('priority')}
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Assign To</label>
                            <select
                                {...register('assignedTo')}
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Unassigned</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Due Date</label>
                        <input
                            type="date"
                            {...register('dueDate', { required: 'Due date is required' })}
                            className={`w-full bg-slate-900 border ${errors.dueDate ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                        />
                        {errors.dueDate && <p className="text-red-400 text-sm">{errors.dueDate.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
