import { z } from "zod"

// ============================================================================
// TYPES
// ============================================================================

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface AuthResponse {
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
  // Common
  emailRequired: "Vui lòng nhập email",
  emailInvalid: "Email không hợp lệ",
  passwordRequired: "Vui lòng nhập mật khẩu",
  passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự",
  networkError: "Lỗi kết nối. Vui lòng thử lại",

  // Login specific
  loginFailed: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin",
  loginSuccess: "Đăng nhập thành công!",
  loginWelcome: "Chào mừng bạn quay trở lại",

  // Register specific
  firstNameRequired: "Vui lòng nhập họ",
  firstNameMinLength: "Họ phải có ít nhất 2 ký tự",
  lastNameRequired: "Vui lòng nhập tên",
  lastNameMinLength: "Tên phải có ít nhất 2 ký tự",
  phoneInvalid: "Số điện thoại không hợp lệ",
  confirmPasswordRequired: "Vui lòng xác nhận mật khẩu",
  passwordMismatch: "Mật khẩu không khớp",
  agreeToTermsRequired: "Bạn phải đồng ý với điều khoản sử dụng",
  registerFailed: "Đăng ký thất bại. Vui lòng thử lại",
  registerSuccess: "Đăng ký thành công!",
  registerWelcome: "Chào mừng bạn đến với AnyTrans",

  // Forgot password specific
  forgotPasswordSuccess: "Email khôi phục mật khẩu đã được gửi",
  forgotPasswordFailed: "Không thể gửi email. Vui lòng thử lại",

  // Reset password specific
  resetPasswordSuccess: "Mật khẩu đã được đặt lại thành công",
  resetPasswordFailed: "Không thể đặt lại mật khẩu. Vui lòng thử lại",
}

// ============================================================================
// ZOD SCHEMA - Login
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
// ZOD SCHEMA - Register
// ============================================================================

export const registerFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, authValidationMessages.firstNameRequired)
      .min(2, authValidationMessages.firstNameMinLength),
    lastName: z
      .string()
      .min(1, authValidationMessages.lastNameRequired)
      .min(2, authValidationMessages.lastNameMinLength),
    email: z
      .string()
      .min(1, authValidationMessages.emailRequired)
      .email(authValidationMessages.emailInvalid),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[+]?[\d\s-]{10,}$/.test(val),
        authValidationMessages.phoneInvalid
      ),
    password: z
      .string()
      .min(1, authValidationMessages.passwordRequired)
      .min(6, authValidationMessages.passwordMinLength),
    confirmPassword: z
      .string()
      .min(1, authValidationMessages.confirmPasswordRequired),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: authValidationMessages.agreeToTermsRequired,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: authValidationMessages.passwordMismatch,
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerFormSchema>

// ============================================================================
// ZOD SCHEMA - Forgot Password
// ============================================================================

export const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, authValidationMessages.emailRequired)
    .email(authValidationMessages.emailInvalid),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

// ============================================================================
// ZOD SCHEMA - Reset Password
// ============================================================================

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, authValidationMessages.passwordRequired)
      .min(6, authValidationMessages.passwordMinLength),
    confirmPassword: z
      .string()
      .min(1, authValidationMessages.confirmPasswordRequired),
    token: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: authValidationMessages.passwordMismatch,
    path: ["confirmPassword"],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const authConfig = {
  loginEndpoint: "/api/auth/login",
  registerEndpoint: "/api/auth/register",
  forgotPasswordEndpoint: "/api/auth/forgot-password",
  resetPasswordEndpoint: "/api/auth/reset-password",
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
