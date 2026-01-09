import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { isAdmin } from '../../lib/permissions';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState(null);

    // Fetch users
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingUserId(userId);
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });

            // Optimistically update local state
            setUsers(prev => prev.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));

            toast.success('Role updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating role');
        } finally {
            setUpdatingUserId(null);
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'manager': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'user': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-slate-500/10 text-slate-400';
        }
    };

    if (!isAdmin()) {
        return (
            <div className="flex justify-center p-8">
                <p className="text-red-400 font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                    You do not have permission to view this page.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">User Management</h1>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden transition-colors">
                {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium text-sm uppercase border-b border-slate-200 dark:border-slate-700/50">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Current Role</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {users?.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)} capitalize`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                disabled={updatingUserId === user._id}
                                                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50 transition-colors"
                                            >
                                                <option value="user">User</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
