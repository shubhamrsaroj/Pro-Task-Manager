import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiShield, FiBriefcase } from 'react-icons/fi';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/register', {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
            });
            const { token, user } = response.data;

            setAuth(token, user);

            toast.success('Welcome aboard! Your account has been created.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Left Panel - Visual */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-purple-900 to-blue-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />

                {/* Decorative circles */}
                <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-purple-600 blur-[100px] opacity-30" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-600 blur-[100px] opacity-30" />

                <div className="relative z-20 text-white max-w-lg text-center px-10 flex flex-col items-center">
                    <FiBriefcase className="w-20 h-20 text-cyan-400 mb-8" />
                    <h1 className="text-5xl font-bold mb-4">Start Your Journey</h1>
                    <p className="text-xl text-gray-200">
                        Create an account to access powerful tools designed for modern teams.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-900">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-lg text-gray-400">
                            Already have an account?{' '}
                            <Link to="/auth/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-gray-300 font-medium ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="text-gray-500" />
                                </div>
                                <input
                                    placeholder="John Doe"
                                    className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/20'} text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-500`}
                                    {...register('name', { required: 'Name is required' })}
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-sm mt-1 ml-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-300 font-medium ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'} text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-500`}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                                    })}
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-sm mt-1 ml-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-300 font-medium ml-1">Role</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiShield className="text-gray-500" />
                                </div>
                                <select
                                    className={`w-full bg-white/5 border ${errors.role ? 'border-red-500' : 'border-white/20'} text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none cursor-pointer [&>option]:bg-slate-800`}
                                    {...register('role', { required: 'Role is required' })}
                                >
                                    <option value="">Select role</option>
                                    <option value="user">Employee</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            {errors.role && <p className="text-red-400 text-sm mt-1 ml-1">{errors.role.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-300 font-medium ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/20'} text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-500`}
                                    {...register('password', {
                                        required: 'Required',
                                        minLength: { value: 6, message: 'Min 6 chars' }
                                    })}
                                />
                            </div>
                            {errors.password && <p className="text-red-400 text-sm mt-1 ml-1">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-300 font-medium ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-500`}
                                    {...register('confirmPassword', {
                                        validate: val => val === password || 'Passwords do not match'
                                    })}
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1 ml-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3.5 rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
