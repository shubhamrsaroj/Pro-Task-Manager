import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    } = useForm();

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    } = useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/profile');
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const onProfileSubmit = async (data) => {
        try {
            await api.put('/users/profile', data);
            toast.success('Profile updated successfully');
            // Allow form state to handling loading via isSubmitting, 
            // but we might want to refresh user data if it changed significantly
            setUser(prev => ({ ...prev, ...data }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        }
    };

    const onPasswordSubmit = async (data) => {
        try {
            await api.put('/users/password', data);
            resetPassword();
            toast.success('Password updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating password');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Profile</h1>

            {/* User Info Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm transition-colors">
                <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/30">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{user?.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-2">{user?.email}</p>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${user?.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                            {user?.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Edit Profile Form */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit Profile</h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                            <input
                                defaultValue={user?.name}
                                {...registerProfile('name', { required: 'Name is required' })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            {profileErrors.name && <p className="text-red-500 dark:text-red-400 text-sm">{profileErrors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input
                                defaultValue={user?.email}
                                {...registerProfile('email', { required: 'Email is required' })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            {profileErrors.email && <p className="text-red-500 dark:text-red-400 text-sm">{profileErrors.email.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isProfileSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {isProfileSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Change Password</h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                            <input
                                type="password"
                                {...registerPassword('currentPassword', { required: 'Current password is required' })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            {passwordErrors.currentPassword && <p className="text-red-500 dark:text-red-400 text-sm">{passwordErrors.currentPassword.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                            <input
                                type="password"
                                {...registerPassword('newPassword', {
                                    required: 'New password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            {passwordErrors.newPassword && <p className="text-red-500 dark:text-red-400 text-sm">{passwordErrors.newPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isPasswordSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
