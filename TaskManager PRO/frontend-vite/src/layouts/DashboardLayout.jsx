import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    FiMenu, FiHome, FiList, FiUsers, FiSettings, FiLogOut, FiUser, FiPieChart, FiX
} from 'react-icons/fi';

const NavItem = ({ icon: Icon, children, path, active }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => {
                navigate(path);
                sessionStorage.setItem('currentPath', path);
            }}
            className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 mx-2 mb-1 rounded-lg ${active
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                }`}
        >
            <Icon className="mr-4 text-lg" />
            <span className="font-medium">{children}</span>
        </div>
    );
};

export default function DashboardLayout({ children }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { user: userData, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = userData?.role === 'admin';
    const canAccessUsers = isAdmin;

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 fixed h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-20 transition-colors duration-200">
                <div className="flex items-center h-20 px-8 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-center bg-blue-600 w-8 h-8 rounded-lg mr-3 shadow-lg shadow-blue-500/30">
                        <span className="font-bold text-white text-sm">TM</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        TaskManager <span className="text-blue-500">PRO</span>
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-6 py-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Main Menu</span>
                    </div>
                    <NavItem icon={FiHome} path="/dashboard" active={location.pathname === '/dashboard'}>
                        Dashboard
                    </NavItem>
                    <NavItem icon={FiList} path="/dashboard/tasks" active={location.pathname.includes('/dashboard/tasks')}>
                        Tasks
                    </NavItem>
                    <NavItem icon={FiPieChart} path="/dashboard/reports" active={location.pathname.includes('/dashboard/reports')}>
                        Analytics
                    </NavItem>
                    {canAccessUsers && (
                        <NavItem icon={FiUsers} path="/dashboard/users" active={location.pathname.includes('/dashboard/users')}>
                            Users
                        </NavItem>
                    )}

                    <div className="px-6 py-2 mt-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Settings</span>
                    </div>
                    <NavItem icon={FiUser} path="/dashboard/profile" active={location.pathname.includes('/dashboard/profile')}>
                        Profile
                    </NavItem>
                    <NavItem icon={FiSettings} path="/dashboard/settings" active={location.pathname.includes('/dashboard/settings')}>
                        Settings
                    </NavItem>
                </div>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <FiLogOut className="mr-4 text-lg" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileOpen(false)}>
                    <div className="w-64 h-full bg-slate-800 p-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-lg text-white">Menu</span>
                            <button onClick={() => setIsMobileOpen(false)} className="text-white"><FiX /></button>
                        </div>
                        <NavItem icon={FiHome} path="/dashboard" active={location.pathname === '/dashboard'}>Dashboard</NavItem>
                        <NavItem icon={FiList} path="/dashboard/tasks" active={location.pathname.includes('/dashboard/tasks')}>
                            Tasks
                        </NavItem>
                        <NavItem icon={FiPieChart} path="/dashboard/reports" active={location.pathname.includes('/dashboard/reports')}>
                            Analytics
                        </NavItem>
                        {canAccessUsers && (
                            <NavItem icon={FiUsers} path="/dashboard/users" active={location.pathname.includes('/dashboard/users')}>
                                Users
                            </NavItem>
                        )}
                        <NavItem icon={FiUser} path="/dashboard/profile" active={location.pathname.includes('/dashboard/profile')}>
                            Profile
                        </NavItem>
                        <NavItem icon={FiSettings} path="/dashboard/settings" active={location.pathname.includes('/dashboard/settings')}>
                            Settings
                        </NavItem>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 backdrop-blur-md transition-colors duration-200">
                    <button
                        className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-black"
                        onClick={() => setIsMobileOpen(true)}
                    >
                        <FiMenu className="text-2xl" />
                    </button>

                    <div className="flex items-center space-x-4 ml-auto">
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 focus:outline-none group"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-blue-500/20 transition-all">
                                    {userData?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="hidden md:flex flex-col items-start text-left">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-black group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{userData?.name}</span>
                                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wide border border-blue-200 dark:border-blue-500/20">
                                        {userData?.role}
                                    </span>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 transform origin-top-right transition-all">
                                        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 mb-1 md:hidden">
                                            <p className="text-slate-900 dark:text-white font-medium">{userData?.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{userData?.email}</p>
                                        </div>

                                        <button onClick={() => { navigate('/dashboard/profile'); setIsProfileOpen(false); }} className="text-left w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white flex items-center">
                                            <FiUser className="mr-3" /> Profile
                                        </button>
                                        <button onClick={() => { navigate('/dashboard/settings'); setIsProfileOpen(false); }} className="text-left w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white flex items-center">
                                            <FiSettings className="mr-3" /> Settings
                                        </button>
                                        <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                        <button onClick={handleLogout} className="text-left w-full px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 flex items-center">
                                            <FiLogOut className="mr-3" /> Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
