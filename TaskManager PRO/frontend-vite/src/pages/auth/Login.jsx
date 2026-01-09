import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom'; // Use react-router-dom Link, NOT Chakra Link
import { FiMail, FiLock, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', data);
            const { token, user } = response.data;

            setAuth(token, user);

            toast.success('Welcome back! You have been logged in.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Left Panel - Visual */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-900 to-blue-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />

                {/* Decorative circles */}
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-purple-500 blur-[100px] opacity-30" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-500 blur-[100px] opacity-30" />

                <div className="relative z-20 text-white max-w-lg text-center px-10 flex flex-col items-center">
                    <FiCheckCircle className="w-20 h-20 text-blue-400 mb-8" />
                    <h1 className="text-5xl font-bold mb-4">Task Master PRO</h1>
                    <p className="text-xl text-gray-200">
                        Join thousands of teams simplifying their workflow and boosting productivity.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-900">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-white mb-2">Sign In</h2>
                        <p className="text-lg text-gray-400">
                            New here?{' '}
                            <Link to="/auth/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-gray-300 font-medium ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'} text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500`}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1 ml-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-300 font-medium ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-500" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/20'} text-white rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500`}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters',
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1 ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
