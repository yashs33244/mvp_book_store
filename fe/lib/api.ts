import axios from 'axios';

// Force production URL if we're in production environment
const getApiUrl = () => {
  // In development mode, use localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }
  // In production, always use the production URL
  return 'https://apibooks.yashprojects.online';
};

const API_URL = getApiUrl();

console.log('API URL being used:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Only run this in browser environment to prevent hydration errors
if (typeof window !== 'undefined') {
  // Add a request interceptor to add the auth token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request to: ${config.baseURL}${config.url}`);
    return config;
  });

  // Add a response interceptor to handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error.response?.status, error.message, error.config?.url);
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}

/**
 * Helper to safely get the auth token (client-side only)
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Check if user is authenticated (client-side only)
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
}; 