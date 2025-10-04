// Type definitions based on the new API documentation
export interface User {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'business_owner' | 'staff' | 'admin';
  is_active: boolean;
  last_login?: string;
  timezone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'business_owner' | 'staff' | 'admin';
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  timezone?: string;
}

export interface UserSession {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  user_id: string;
  token: string;
  expires_at: string;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

// API Error response format
export interface ApiErrorResponse {
  error: AuthError;
}