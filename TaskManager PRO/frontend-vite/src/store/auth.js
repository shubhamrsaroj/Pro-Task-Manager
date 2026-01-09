import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple factory function to create the store
const createAuthStore = () => {
    return create()(
        persist(
            (set) => ({
                token: null,
                user: null,
                isAuthenticated: false,
                setAuth: (token, user) =>
                    set({
                        token,
                        user,
                        isAuthenticated: true,
                    }),
                logout: () =>
                    set({
                        token: null,
                        user: null,
                        isAuthenticated: false,
                    }),
            }),
            {
                name: 'auth-storage',
                getStorage: () => sessionStorage, // Use sessionStorage for tab isolation
            }
        )
    );
};

// Create the store
const useAuthStore = createAuthStore();

export { useAuthStore };
