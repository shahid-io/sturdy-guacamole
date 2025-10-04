import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 unauthorized with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'wiplash_refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          
          // Update stored tokens
          localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token', access_token);
          localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'wiplash_refresh_token', newRefreshToken);
          
          // Update default header
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          
          processQueue(null, access_token);
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token');
          localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'wiplash_refresh_token');
          window.location.href = '/login';
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token, clear tokens and redirect to login
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token');
        localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'wiplash_refresh_token');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Forbidden: Insufficient permissions');
    } else if (error.response?.status === 429) {
      // Rate limit exceeded
      console.error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status !== undefined && error.response.status >= 500) {
      // Server error
      console.error('Server error:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// API response types based on your backend structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
  timestamp?: string;
}

// Generic API call function
export const apiCall = async <T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  config?: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with error
      return error.response.data;
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    } else {
      // Other error
      return {
        success: false,
        error: 'An unexpected error occurred.',
      };
    }
  }
};

export default apiClient;