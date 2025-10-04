import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService, tokenManager } from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getAccessToken();
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to refresh user:', error);
          tokenManager.removeAllTokens();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        tokenManager.setTokens(response.data.access_token, response.data.refresh_token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Login failed' 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        // Note: Registration returns user info but might not auto-login
        // Check if the response includes tokens (auto-login) or just user info
        if ('access_token' in response.data) {
          // Auto-login after registration
          const loginData = response.data as any;
          tokenManager.setTokens(loginData.access_token, loginData.refresh_token);
          setUser(loginData.user);
          setIsAuthenticated(true);
        } else {
          // Registration successful but no auto-login
          // User needs to verify email or login separately
        }
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Registration failed' 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      tokenManager.removeAllTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        throw new Error('Failed to get user profile');
      }
    } catch (error) {
      tokenManager.removeAllTokens();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};