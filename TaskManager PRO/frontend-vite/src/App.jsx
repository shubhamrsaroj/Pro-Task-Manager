import { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardHome from './pages/dashboard/DashboardHome';
import Tasks from './pages/dashboard/Tasks';
import Users from './pages/dashboard/Users';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';
import Analytics from './pages/dashboard/Analytics';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

// Dashboard Route Wrapper (applies layout)
const DashboardRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    // Removed QueryClientProvider and ChakraProvider
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <DashboardRoute>
                <DashboardHome />
              </DashboardRoute>
            } />

            <Route path="/dashboard/tasks/*" element={
              <DashboardRoute>
                <Tasks />
              </DashboardRoute>
            } />
            <Route path="/dashboard/reports" element={
              <DashboardRoute>
                <Analytics />
              </DashboardRoute>
            } />
            <Route path="/dashboard/users" element={
              <DashboardRoute>
                <Users />
              </DashboardRoute>
            } />
            <Route path="/dashboard/settings" element={
              <DashboardRoute>
                <Settings />
              </DashboardRoute>
            } />
            <Route path="/dashboard/profile" element={
              <DashboardRoute>
                <Profile />
              </DashboardRoute>
            } />

            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
