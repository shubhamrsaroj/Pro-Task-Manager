import axios from 'axios';

// Create API instance with timeout and better error handling
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 second timeout
    withCredentials: true, // Important for CORS with credentials
});

// Add request debugging in non-production environments
const isDev = import.meta.env.MODE !== 'production';

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Read directly from sessionStorage for the token
        const storedAuth = sessionStorage.getItem('auth-storage');
        let token = null;
        if (storedAuth) {
            try {
                token = JSON.parse(storedAuth).token;
            } catch (e) {
                console.error("Error parsing auth token", e);
            }
        }

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (isDev) {
            console.log(`API Request [${config.method?.toUpperCase()}] ${config.url}`, {
                data: config.data,
                headers: config.headers,
            });
        }

        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        if (isDev) {
            console.log(`API Response [${response.status}] ${response.config.url}`, {
                data: response.data,
            });
        }
        return response;
    },
    (error) => {
        // Log detailed error information
        const errorDetails = {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
        };

        console.error('API Response Error:', errorDetails);
        return Promise.reject(error);
    }
);

export default api;
