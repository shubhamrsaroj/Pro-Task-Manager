// Helper to get auth state from storage
const getAuthDetails = () => {
    try {
        const authData = sessionStorage.getItem('auth-storage');
        if (authData) {
            return JSON.parse(authData);
        }
    } catch (e) {
        console.error("Error reading auth storage", e);
    }
    return { token: null, user: null, isAuthenticated: false };
};

// Get auth token directly from storage
export const getToken = () => {
    return getAuthDetails().token;
};

// Get current user directly from storage
export const getUser = () => {
    return getAuthDetails().user;
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Log out user (this is a helper, but actual logout should happen via Context/Hook to update UI)
export const logout = () => {
    sessionStorage.removeItem('auth-storage');
    sessionStorage.removeItem('currentPath');
    window.location.href = '/auth/login'; // Force reload/redirect since we are outside React context
};
