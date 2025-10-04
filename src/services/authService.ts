import { apiCall } from './api';
import type { ApiResponse } from './api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  User, 
  RefreshTokenRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  UpdateProfileRequest,
  ResetPasswordRequest,
  UserSession
} from '../types/auth';

// Auth service functions that match the new API documentation
export const authService = {
  // Register a new user
  register: async (userData: RegisterRequest): Promise<ApiResponse<{ message: string; user: User }>> => {
    return apiCall<{ message: string; user: User }>('POST', '/auth/register', userData);
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiCall<LoginResponse>('POST', '/auth/login', credentials);
  },

  // Refresh access token
  refreshToken: async (refreshTokenData: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    return apiCall<RefreshTokenResponse>('POST', '/auth/refresh', refreshTokenData);
  },

  // Logout user (protected route)
  logout: async (allDevices = false): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/logout', { all_devices: allDevices });
  },

  // Get current user profile (protected route) - endpoint is /auth/me
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiCall<User>('GET', '/auth/me');
  },

  // Update user profile (protected route)
  updateProfile: async (profileData: UpdateProfileRequest): Promise<ApiResponse<{ message: string; user: User }>> => {
    return apiCall<{ message: string; user: User }>('PUT', '/auth/me', profileData);
  },

  // Change password (protected route)
  changePassword: async (passwordData: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/change-password', passwordData);
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (resetData: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/reset-password', resetData);
  },

  // Verify email
  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/verify-email', { token });
  },

  // Resend verification email (protected route)
  resendVerification: async (): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('POST', '/auth/resend-verification');
  },

  // Get user sessions (protected route)
  getSessions: async (): Promise<ApiResponse<{ sessions: UserSession[] }>> => {
    return apiCall<{ sessions: UserSession[] }>('GET', '/auth/sessions');
  },

  // Revoke a specific session (protected route)
  revokeSession: async (sessionId: number): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('DELETE', `/auth/sessions/${sessionId}`);
  },

  // Health check - keeping for backward compatibility
  healthCheck: async (): Promise<ApiResponse<any>> => {
    return apiCall('GET', '/auth/health');
  },

  // Legacy method name - kept for backward compatibility
  getProfile: async (): Promise<ApiResponse<User>> => {
    return authService.getCurrentUser();
  },
};

// Enhanced token manager with refresh token support
export const tokenManager = {
  // Store access token
  setAccessToken: (token: string): void => {
    localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token', token);
  },

  // Store refresh token
  setRefreshToken: (token: string): void => {
    localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'wiplash_refresh_token', token);
  },

  // Store both tokens (convenience method)
  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
  },

  // Get access token
  getAccessToken: (): string | null => {
    return localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token');
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'wiplash_refresh_token');
  },

  // Remove access token
  removeAccessToken: (): void => {
    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'wiplash_auth_token');
  },

  // Remove refresh token
  removeRefreshToken: (): void => {
    localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'wiplash_refresh_token');
  },

  // Remove all tokens
  removeAllTokens: (): void => {
    tokenManager.removeAccessToken();
    tokenManager.removeRefreshToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken();
  },

  // Legacy methods for backward compatibility
  setToken: (token: string): void => {
    tokenManager.setAccessToken(token);
  },

  getToken: (): string | null => {
    return tokenManager.getAccessToken();
  },

  removeToken: (): void => {
    tokenManager.removeAccessToken();
  },
};