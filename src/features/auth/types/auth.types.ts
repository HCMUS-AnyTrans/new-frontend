/**
 * User entity returned from API
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  phone?: string | null;
}

/**
 * Authentication response from login/refresh endpoints
 */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

/**
 * Login credentials DTO
 */
export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration/Signup DTO
 */
export interface SignupDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

/**
 * Forgot password request DTO
 */
export interface ForgotPasswordDto {
  email: string;
}

/**
 * Reset password DTO
 * Note: Backend only requires token and newPassword, not email
 */
export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

/**
 * Change password DTO (for authenticated users)
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * Email verification DTO
 */
export interface VerifyEmailDto {
  email: string;
  token: string;
}

/**
 * Resend email request DTO
 */
export interface ResendEmailDto {
  email: string;
  type: 'email_verification' | 'password_reset';
}

/**
 * Auth state for Zustand store
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

/**
 * Auth actions for Zustand store
 */
export interface AuthActions {
  setAuth: (user: User, accessToken: string) => void;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  setInitialized: (initialized: boolean) => void;
}

/**
 * Combined auth store type
 */
export type AuthStore = AuthState & AuthActions;
