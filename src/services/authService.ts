import { apiCall } from './api';
import type { ApiResponse } from './api';
import type { LoginRequest, RegisterRequest, LoginResponse, User } from '../types/auth';

// Auth service functions that match your backend endpoints
export const authService = {
  // Register a new user
  register: async (userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiCall<LoginResponse>('POST', '/auth/register', userData);
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiCall<LoginResponse>('POST', '/auth/login', credentials);
  },

  // Get user profile (protected route)
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiCall<User>('GET', '/auth/profile');
  },

  // Logout user (protected route)
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/logout');
  },

  // Refresh token (not implemented in backend yet)
  refreshToken: async (): Promise<ApiResponse<LoginResponse>> => {
    return apiCall<LoginResponse>('POST', '/auth/refresh');
  },

  // Forgot password (not implemented in backend yet)
  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/forgot-password', { email });
  },

  // Reset password (not implemented in backend yet)
  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/reset-password', {
      token,
      new_password: password,
      confirm_password: password,
    });
  },

  // Change password (protected route, not implemented in backend yet)
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  // Verify email (not implemented in backend yet)
  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/verify-email', { token });
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse<any>> => {
    return apiCall('GET', '/auth/health');
  },
};

// Helper functions for token management
export const tokenManager = {
  // Store token in localStorage
  setToken: (token: string): void => {
    localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token', token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token');
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  },
};