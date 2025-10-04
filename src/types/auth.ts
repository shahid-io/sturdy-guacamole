// Type definitions based on your backend auth service
export interface User {
  ID: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'business_owner' | 'staff' | 'admin';
  is_active: boolean;
  last_login?: string;
  timezone?: string;
  CreatedAt: string;
  UpdatedAt: string;
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
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
  user: User;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}