import { apiClient } from '@/lib/api-client';
import type {
  AuthResponse,
  LoginDto,
  SignupDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  ResendEmailDto,
  User,
  MessageResponse,
} from '../types';

/**
 * Authentication API endpoints
 */

/**
 * Login with email and password
 */
export async function loginApi(credentials: LoginDto): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

/**
 * Register a new user account
 */
export async function signupApi(data: SignupDto): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>('/auth/signup', data);
  return response.data;
}

/**
 * Logout and invalidate refresh token
 */
export async function logoutApi(): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>('/auth/logout');
  return response.data;
}

/**
 * Refresh access token using refresh token from cookie
 */
export async function refreshTokenApi(): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/refresh');
  return response.data;
}

/**
 * Get current user profile
 */
export async function getCurrentUserApi(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
}

/**
 * Request password reset email
 */
export async function forgotPasswordApi(
  data: ForgotPasswordDto
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/auth/forgot-password',
    data
  );
  return response.data;
}

/**
 * Reset password using token from email
 */
export async function resetPasswordApi(
  data: ResetPasswordDto
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/auth/reset-password',
    data
  );
  return response.data;
}

/**
 * Change password (for authenticated users)
 */
export async function changePasswordApi(
  data: ChangePasswordDto
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/auth/change-password',
    data
  );
  return response.data;
}

/**
 * Verify email address using token from email
 */
export async function verifyEmailApi(
  data: VerifyEmailDto
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/auth/verify-email',
    data
  );
  return response.data;
}

/**
 * Resend verification or password reset email
 */
export async function resendEmailApi(
  data: ResendEmailDto
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/auth/resend-email',
    data
  );
  return response.data;
}

/**
 * Initiate Google OAuth login (redirect)
 */
export function initiateGoogleAuth(): void {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${baseUrl}/auth/google`;
}
