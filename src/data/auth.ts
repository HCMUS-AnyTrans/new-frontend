import { z } from "zod"
import { isValidPhoneNumber } from "react-phone-number-input"

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
  passwordMinLength: "Mật khẩu phải có ít nhất 8 ký tự",
  passwordRequiresLowercase: "Mật khẩu phải có ít nhất 1 chữ thường",
  passwordRequiresUppercase: "Mật khẩu phải có ít nhất 1 chữ hoa",
  passwordRequiresNumber: "Mật khẩu phải có ít nhất 1 số",
  passwordRequiresSymbol: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
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
  phoneInvalid: "Số điện thoại phải có mã quốc gia (ví dụ: +84901234567)",
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
    .min(8, authValidationMessages.passwordMinLength),
  rememberMe: z.boolean().default(false),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

// ============================================================================
// PASSWORD VALIDATION HELPER
// ============================================================================

/**
 * Strong password schema matching backend @IsStrongPassword() requirements:
 * - Minimum 8 characters
 * - At least 1 lowercase letter
 * - At least 1 uppercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const strongPasswordSchema = z
  .string()
  .min(1, authValidationMessages.passwordRequired)
  .min(8, authValidationMessages.passwordMinLength)
  .regex(/[a-z]/, authValidationMessages.passwordRequiresLowercase)
  .regex(/[A-Z]/, authValidationMessages.passwordRequiresUppercase)
  .regex(/[0-9]/, authValidationMessages.passwordRequiresNumber)
  .regex(/[^a-zA-Z0-9]/, authValidationMessages.passwordRequiresSymbol)

/**
 * E.164 phone number format validation using react-phone-number-input
 * Uses the library's built-in validation for proper international phone numbers
 */
export const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || isValidPhoneNumber(val),
    authValidationMessages.phoneInvalid
  )

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
    phone: phoneSchema,
    password: strongPasswordSchema,
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
    password: strongPasswordSchema,
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
