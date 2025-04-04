
import { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';
import { EnhancedApiClient } from './enhancedApiClient';
import { BACKEND_CONFIG } from '../../config/backend.config';

// User role type
export type UserRole = 'admin' | 'manager' | 'agent' | 'client';

// User profile
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
  settings?: Record<string, any>;
}

// Authentication tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Password reset
export interface PasswordResetRequest {
  email: string;
}

// Password update
export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth service interface
export interface AuthService {
  // Authentication
  login(credentials: LoginCredentials): Promise<ApiResponse<{ user: UserProfile; tokens: AuthTokens }>>;
  logout(): Promise<ApiResponse<void>>;
  refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>>;
  forgotPassword(request: PasswordResetRequest): Promise<ApiResponse<{ success: boolean }>>;
  resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>>;
  
  // Profile management
  getCurrentUser(): Promise<ApiResponse<UserProfile>>;
  updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>>;
  updatePassword(data: PasswordUpdateRequest): Promise<ApiResponse<{ success: boolean }>>;
  updateAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>>;
  
  // Registration
  register(email: string, password: string, firstName: string, lastName: string): Promise<ApiResponse<{ user: UserProfile; tokens: AuthTokens }>>;
  verifyEmail(token: string): Promise<ApiResponse<{ success: boolean }>>;
  
  // Password security
  checkPasswordStrength(password: string): Promise<ApiResponse<{
    score: number; // 0-4, 0 = very weak, 4 = very strong
    feedback: string[];
  }>>;
  
  // User settings
  updateSettings(settings: Record<string, any>): Promise<ApiResponse<UserProfile>>;
  getSettings(): Promise<ApiResponse<Record<string, any>>>;
}

// Auth service implementation
class AuthServiceImpl implements AuthService {
  constructor(private apiClient: EnhancedApiClient) {}

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: UserProfile; tokens: AuthTokens }>> {
    return this.apiClient.post<{ user: UserProfile; tokens: AuthTokens }>(
      BACKEND_CONFIG.AUTH.LOGIN,
      credentials
    );
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.apiClient.post<void>('/auth/logout', {});
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return this.apiClient.post<AuthTokens>(BACKEND_CONFIG.AUTH.REFRESH, { refreshToken });
  }

  async forgotPassword(request: PasswordResetRequest): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post<{ success: boolean }>(BACKEND_CONFIG.AUTH.FORGOT_PASSWORD, request);
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post<{ success: boolean }>(BACKEND_CONFIG.AUTH.RESET_PASSWORD, {
      token,
      newPassword
    });
  }

  // Profile management
  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return this.apiClient.get<UserProfile>('/auth/me');
  }

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.apiClient.put<UserProfile>('/auth/profile', data);
  }

  async updatePassword(data: PasswordUpdateRequest): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.put<{ success: boolean }>('/auth/password', data);
  }

  async updateAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.apiClient.request<{ avatarUrl: string }>('/auth/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove content-type header to let the browser set it with the correct boundary
      }
    });
  }

  // Registration
  async register(email: string, password: string, firstName: string, lastName: string): Promise<ApiResponse<{ user: UserProfile; tokens: AuthTokens }>> {
    return this.apiClient.post<{ user: UserProfile; tokens: AuthTokens }>(BACKEND_CONFIG.AUTH.REGISTER, {
      email,
      password,
      firstName,
      lastName
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post<{ success: boolean }>('/auth/verify-email', { token });
  }

  // Password security
  async checkPasswordStrength(password: string): Promise<ApiResponse<{
    score: number;
    feedback: string[];
  }>> {
    return this.apiClient.post<{
      score: number;
      feedback: string[];
    }>('/auth/password-strength', { password });
  }

  // User settings
  async updateSettings(settings: Record<string, any>): Promise<ApiResponse<UserProfile>> {
    return this.apiClient.put<UserProfile>('/auth/settings', { settings });
  }

  async getSettings(): Promise<ApiResponse<Record<string, any>>> {
    return this.apiClient.get<Record<string, any>>('/auth/settings');
  }
}

export class AuthServiceProvider implements ServiceProvider<AuthService> {
  createService(client: EnhancedApiClient): AuthService {
    return new AuthServiceImpl(client);
  }
}
