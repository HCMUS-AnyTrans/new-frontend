import { z } from "zod"

// ============================================================================
// TYPES
// ============================================================================

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    email: string
    name: string
  }
  message?: string
}

export interface AuthError {
  field?: string
  message: string
}

// ============================================================================
// VALIDATION MESSAGES
// ============================================================================

export const authValidationMessages = {
  emailRequired: "Vui lòng nhập email",
  emailInvalid: "Email không hợp lệ",
  passwordRequired: "Vui lòng nhập mật khẩu",
  passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự",
  loginFailed: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin",
  networkError: "Lỗi kết nối. Vui lòng thử lại",
  successTitle: "Đăng nhập thành công!",
  successMessage: "Chào mừng bạn quay trở lại",
}

// ============================================================================
// ZOD SCHEMA - For form validation
// ============================================================================

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, authValidationMessages.emailRequired)
    .email(authValidationMessages.emailInvalid),
  password: z
    .string()
    .min(1, authValidationMessages.passwordRequired)
    .min(6, authValidationMessages.passwordMinLength),
  rememberMe: z.boolean().default(false),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const authConfig = {
  loginEndpoint: "/api/auth/login",
  logoutEndpoint: "/api/auth/logout",
  tokenKey: "auth_token",
  userKey: "auth_user",
}

// ============================================================================
// SOCIAL LOGIN PROVIDERS
// ============================================================================

export interface SocialProvider {
  id: string
  name: string
  icon: string
  color: string
  bgColor?: string
}

export const socialLoginProviders: SocialProvider[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: "/authen/facebook-icon.svg",
    color: "#1877f2",
    bgColor: "bg-[#1877f2]",
  },
  {
    id: "google",
    name: "Google",
    icon: "/authen/google.svg",
    color: "#4285f4",
  },
]
