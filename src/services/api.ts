import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Environment variable for API URL or default to the provided production URL
// Note: User prompt specified https://saber-api-backend.vercel.app as production base URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://saber-api-backend.vercel.app';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token & Handle Caching
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Caching Logic for GET requests
        if (config.method?.toLowerCase() === 'get') {
            try {
                const key = `api_cache_${config.url}_${JSON.stringify(config.params || {})}`;
                const cached = localStorage.getItem(key);

                if (cached) {
                    const data = JSON.parse(cached);
                    // Override the adapter for this specific request to return cached data
                    // avoiding the actual network call
                    config.adapter = () => {
                        return Promise.resolve({
                            data,
                            status: 200,
                            statusText: 'OK',
                            headers: {},
                            config,
                            request: {}
                        });
                    };
                }
            } catch (e) {
                console.warn('Error accessing cache', e);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors & Cache Responses
api.interceptors.response.use(
    (response) => {
        // Cache successful GET responses
        if (response.config.method?.toLowerCase() === 'get') {
            try {
                const key = `api_cache_${response.config.url}_${JSON.stringify(response.config.params || {})}`;
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.warn('Failed to cache response', e);
            }
        }
        return response;
    },
    (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            // Token expired or invalid
            useAuthStore.getState().logout();
        } else if (status === 429) {
            console.error("Rate limit reached");
            window.dispatchEvent(new CustomEvent('api-rate-limit'));
        }

        return Promise.reject(error);
    }
);
