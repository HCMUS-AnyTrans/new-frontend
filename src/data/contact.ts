import {
  Mail,
  MapPin,
  Clock,
  Facebook,
  Linkedin,
  LucideIcon,
} from "lucide-react"
import { z } from "zod"

// ============================================================================
// TYPES
// ============================================================================

export interface ContactTopic {
  id: string
  label: string
  icon: string
}

export interface ContactPageInfoItem {
  icon: LucideIcon
  label: string
  value: string
}

export interface ContactPageSocialLink {
  name: string
  handle: string
  icon: LucideIcon
  href: string
}

export interface ContactFormConfig {
  maxMessageLength: number
  ticketPrefix: string
}

// ============================================================================
// CONTACT TOPICS - For form topic selector
// ============================================================================

export const contactTopics: ContactTopic[] = [
  { id: "support", label: "Hỗ trợ", icon: "💬" },
  { id: "partnership", label: "Hợp tác", icon: "💼" },
  { id: "enterprise", label: "Enterprise", icon: "📊" },
  { id: "other", label: "Khác", icon: "❓" },
]

// ============================================================================
// CONTACT INFO - For info panel
// ============================================================================

export const contactPageInfo: ContactPageInfoItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: "support@anytrans.ai",
  },
  {
    icon: MapPin,
    label: "Địa chỉ",
    value: "TP. Hồ Chí Minh, Việt Nam",
  },
  {
    icon: Clock,
    label: "Giờ hoạt động",
    value: "24/7 — Luôn sẵn sàng hỗ trợ",
  },
]

// ============================================================================
// SOCIAL LINKS
// ============================================================================

export const contactPageSocialLinks: ContactPageSocialLink[] = [
  {
    name: "Facebook",
    handle: "anytrans.ai",
    icon: Facebook,
    href: "https://facebook.com/anytrans.ai",
  },
  {
    name: "LinkedIn",
    handle: "anytrans",
    icon: Linkedin,
    href: "https://linkedin.com/company/anytrans",
  },
  {
    name: "Email",
    handle: "support@anytrans.ai",
    icon: Mail,
    href: "mailto:support@anytrans.ai",
  },
]

// ============================================================================
// FORM CONFIG
// ============================================================================

export const contactFormConfig: ContactFormConfig = {
  maxMessageLength: 1000,
  ticketPrefix: "ANT",
}

// ============================================================================
// VALIDATION MESSAGES
// ============================================================================

export const contactValidationMessages = {
  required: "Vui lòng điền tất cả các trường bắt buộc.",
  invalidEmail: "Email không hợp lệ. Vui lòng kiểm tra lại.",
  successTitle: "Đã gửi thành công!",
  successMessage:
    "Chúng tôi đã nhận được tin nhắn của bạn. Đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ.",
}

// Aliases for backward compatibility
export { contactFormConfig as formConfig }
export { contactValidationMessages as validationMessages }

// ============================================================================
// ZOD SCHEMA - For form validation
// ============================================================================

export const contactFormSchema = z.object({
  topic: z.string(),
  name: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  message: z
    .string()
    .min(1, "Vui lòng nhập tin nhắn")
    .max(1000, "Tối đa 1000 ký tự"),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
