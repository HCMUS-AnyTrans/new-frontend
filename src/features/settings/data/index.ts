// =====================================================================
// SETTINGS STATIC CONFIG DATA
// =====================================================================

import type { SettingsTabConfig } from "../types"

// =============== TABS CONFIG ===============

export const settingsTabs: SettingsTabConfig[] = [
  { id: "profile", label: "Hồ sơ", icon: "User", description: "Thông tin cá nhân" },
  { id: "preferences", label: "Tùy chọn", icon: "Settings", description: "Cài đặt hệ thống" },
  { id: "security", label: "Bảo mật", icon: "Shield", description: "Mật khẩu & đăng nhập" },
  { id: "notifications", label: "Thông báo", icon: "Bell", description: "Quản lý thông báo" },
  { id: "billing", label: "Thanh toán", icon: "CreditCard", description: "Credits & giao dịch" },
  { id: "files", label: "Tệp", icon: "FolderOpen", description: "Quản lý tệp" },
  { id: "activity", label: "Hoạt động", icon: "History", description: "Nhật ký hoạt động" },
]

// =============== LANGUAGE OPTIONS ===============

export const uiLanguageOptions = [
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
] as const

export const themeOptions = [
  { value: "light", label: "Sáng", icon: "Sun" },
  { value: "dark", label: "Tối", icon: "Moon" },
  { value: "system", label: "Hệ thống", icon: "Monitor" },
] as const

export const fileTtlOptions = [
  { value: 10080, label: "7 ngày" },
  { value: 20160, label: "14 ngày" },
  { value: 43200, label: "30 ngày" },
  { value: 86400, label: "60 ngày" },
  { value: 129600, label: "90 ngày" },
] as const

// =============== PROVIDER OPTIONS ===============

export const authProviderOptions = [
  { id: "google", name: "Google", icon: "Google", color: "#EA4335" },
] as const
