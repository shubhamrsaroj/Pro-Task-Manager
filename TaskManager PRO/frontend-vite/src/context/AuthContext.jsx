import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state lazily to avoid "flicker" of unauthenticated state
    const [authState, setAuthState] = useState(() => {
        try {
            const storedAuth = sessionStorage.getItem('auth-storage');
            if (storedAuth) {
                const parsed = JSON.parse(storedAuth);
                if (parsed.token) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Failed to parse auth storage", error);
        }
        return {
            token: null,
            user: null,
            isAuthenticated: false,
        };
    });

    // We still want to sync updates TO storage
    useEffect(() => {
        if (authState.token) {
            sessionStorage.setItem('auth-storage', JSON.stringify(authState));
        } else {
            sessionStorage.removeItem('auth-storage');
            // We don't remove currentPath here, we might want to redirect back after login
        }
    }, [authState]);

    const setAuth = (token, user) => {
        setAuthState({
            token,
            user,
            isAuthenticated: true,
        });
    };

    const logout = () => {
        setAuthState({
            token: null,
            user: null,
            isAuthenticated: false,
        });
        sessionStorage.removeItem('currentPath');
    };

    return (
        <AuthContext.Provider value={{ ...authState, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
