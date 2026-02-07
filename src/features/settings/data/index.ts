// =====================================================================
// SETTINGS MOCK DATA
// =====================================================================

import type {
  UserProfile,
  UserPreferences,
  AuthIdentity,
  Session,
  Notification,
  NotificationPreference,
  Wallet,
  WalletLedger,
  Payment,
  CreditPackage,
  UserFile,
  StorageUsage,
  AuditLog,
  SettingsTabConfig,
} from "../types"

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
  { value: 7, label: "7 ngày" },
  { value: 14, label: "14 ngày" },
  { value: 30, label: "30 ngày" },
  { value: 60, label: "60 ngày" },
  { value: 90, label: "90 ngày" },
] as const

// =============== MOCK USER PROFILE ===============

export const mockUserProfile: UserProfile = {
  id: "user-001",
  email: "nguyenvana@gmail.com",
  fullName: "Nguyễn Văn A",
  phone: "+84 912 345 678",
  avatarUrl: null,
  isOAuthUser: true,
  emailVerified: true,
  createdAt: "2024-01-15T10:00:00Z",
  lastLoginAt: "2026-02-06T08:30:00Z",
}

// =============== MOCK PREFERENCES ===============

export const mockUserPreferences: UserPreferences = {
  uiLanguage: "vi",
  theme: "system",
  sendResultViaEmail: true,
  fileTtl: 30,
}

// =============== MOCK AUTH IDENTITIES ===============

export const mockAuthIdentities: AuthIdentity[] = [
  {
    id: "auth-001",
    provider: "google",
    providerId: "google-12345",
    email: "nguyenvana@gmail.com",
    linkedAt: "2024-01-15T10:00:00Z",
  },
]

// =============== MOCK SESSIONS ===============

export const mockSessions: Session[] = [
  {
    id: "session-001",
    device: "Desktop",
    browser: "Chrome",
    os: "Windows 11",
    ip: "113.161.xxx.xxx",
    location: "Hà Nội, Việt Nam",
    lastActiveAt: "2026-02-06T10:30:00Z",
    createdAt: "2026-02-06T08:00:00Z",
    isCurrent: true,
  },
  {
    id: "session-002",
    device: "Mobile",
    browser: "Safari",
    os: "iOS 17",
    ip: "115.73.xxx.xxx",
    location: "TP. Hồ Chí Minh, Việt Nam",
    lastActiveAt: "2026-02-04T15:20:00Z",
    createdAt: "2026-02-01T09:00:00Z",
    isCurrent: false,
  },
]

// =============== MOCK NOTIFICATIONS ===============

export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    type: "translation_complete",
    title: "Dịch hoàn tất",
    message: 'Tài liệu "báo cáo Q4.pdf" đã được dịch xong.',
    read: false,
    createdAt: "2026-02-06T10:25:00Z",
    link: "/history/job-123",
  },
  {
    id: "notif-002",
    type: "credit_purchase",
    title: "Nạp credits thành công",
    message: "Bạn đã nạp thành công 500 credits vào tài khoản.",
    read: false,
    createdAt: "2026-02-06T09:00:00Z",
  },
  {
    id: "notif-003",
    type: "file_expiring",
    title: "File sắp hết hạn",
    message: '3 file sẽ hết hạn lưu trữ trong 7 ngày tới.',
    read: true,
    createdAt: "2026-02-04T08:00:00Z",
    link: "/settings/files",
  },
  {
    id: "notif-004",
    type: "security_alert",
    title: "Đăng nhập mới",
    message: "Phát hiện đăng nhập từ thiết bị mới tại TP.HCM.",
    read: true,
    createdAt: "2026-02-01T14:30:00Z",
  },
]

export const mockNotificationPreferences: NotificationPreference[] = [
  {
    type: "translation_complete",
    label: "Dịch hoàn tất",
    description: "Thông báo khi tài liệu được dịch xong",
    emailEnabled: true,
    pushEnabled: true,
  },
  {
    type: "credit_purchase",
    label: "Nạp credits",
    description: "Thông báo khi nạp credits thành công",
    emailEnabled: true,
    pushEnabled: false,
  },
  {
    type: "file_expiring",
    label: "File sắp hết hạn",
    description: "Nhắc nhở khi file sắp bị xóa",
    emailEnabled: true,
    pushEnabled: true,
  },
  {
    type: "security_alert",
    label: "Cảnh báo bảo mật",
    description: "Đăng nhập từ thiết bị mới, thay đổi mật khẩu",
    emailEnabled: true,
    pushEnabled: true,
  },
  {
    type: "promotion",
    label: "Khuyến mãi",
    description: "Ưu đãi và chương trình khuyến mãi",
    emailEnabled: false,
    pushEnabled: false,
  },
]

// =============== MOCK WALLET & BILLING ===============

export const mockWallet: Wallet = {
  id: "wallet-001",
  balance: 1250,
  autoRechargeEnabled: false,
  autoRechargeThreshold: null,
  autoRechargePackageId: null,
}

export const mockWalletLedger: WalletLedger[] = [
  {
    id: "ledger-001",
    type: "credit",
    amount: 500,
    balanceAfter: 1250,
    description: "Nạp gói 500 Credits",
    createdAt: "2026-02-06T09:00:00Z",
    referenceId: "payment-001",
  },
  {
    id: "ledger-002",
    type: "debit",
    amount: -25,
    balanceAfter: 750,
    description: 'Dịch tài liệu "báo cáo Q4.pdf"',
    createdAt: "2026-02-05T14:30:00Z",
    referenceId: "job-123",
  },
  {
    id: "ledger-003",
    type: "debit",
    amount: -50,
    balanceAfter: 775,
    description: 'Dịch tài liệu "hợp đồng.docx"',
    createdAt: "2026-02-03T10:15:00Z",
    referenceId: "job-122",
  },
  {
    id: "ledger-004",
    type: "bonus",
    amount: 100,
    balanceAfter: 825,
    description: "Thưởng đăng ký tài khoản",
    createdAt: "2026-01-15T10:00:00Z",
  },
]

export const mockPayments: Payment[] = [
  {
    id: "payment-001",
    amount: 450000,
    credits: 500,
    status: "completed",
    method: "vnpay",
    createdAt: "2026-02-06T08:55:00Z",
    completedAt: "2026-02-06T09:00:00Z",
  },
  {
    id: "payment-002",
    amount: 99000,
    credits: 100,
    status: "completed",
    method: "momo",
    createdAt: "2026-01-20T11:00:00Z",
    completedAt: "2026-01-20T11:02:00Z",
  },
]

export const mockCreditPackages: CreditPackage[] = [
  {
    id: "pkg-100",
    name: "Gói Starter",
    credits: 100,
    price: 99000,
    currency: "VND",
    discount: null,
    isBestValue: false,
    isPopular: false,
  },
  {
    id: "pkg-500",
    name: "Gói Basic",
    credits: 500,
    price: 450000,
    currency: "VND",
    discount: 10,
    isBestValue: false,
    isPopular: true,
  },
  {
    id: "pkg-1000",
    name: "Gói Pro",
    credits: 1000,
    price: 850000,
    currency: "VND",
    discount: 15,
    isBestValue: true,
    isPopular: false,
  },
  {
    id: "pkg-5000",
    name: "Gói Enterprise",
    credits: 5000,
    price: 4000000,
    currency: "VND",
    discount: 20,
    isBestValue: false,
    isPopular: false,
  },
]

// =============== MOCK FILES ===============

export const mockUserFiles: UserFile[] = [
  {
    id: "file-001",
    name: "báo cáo Q4.pdf",
    size: 2621440, // 2.5 MB
    type: "pdf",
    status: "active",
    createdAt: "2026-02-05T14:00:00Z",
    expiresAt: "2026-03-07T14:00:00Z",
  },
  {
    id: "file-002",
    name: "hợp đồng dịch vụ.docx",
    size: 1258291, // 1.2 MB
    type: "docx",
    status: "active",
    createdAt: "2026-02-03T10:00:00Z",
    expiresAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "file-003",
    name: "thuyết trình sản phẩm.pptx",
    size: 5242880, // 5 MB
    type: "pptx",
    status: "active",
    createdAt: "2026-02-01T09:00:00Z",
    expiresAt: "2026-02-09T09:00:00Z", // Expiring soon
  },
  {
    id: "file-004",
    name: "tài liệu kỹ thuật.pdf",
    size: 3145728, // 3 MB
    type: "pdf",
    status: "active",
    createdAt: "2026-01-25T16:00:00Z",
    expiresAt: "2026-02-24T16:00:00Z",
  },
]

export const mockStorageUsage: StorageUsage = {
  used: 2684354560, // 2.5 GB
  total: 10737418240, // 10 GB
  fileCount: 15,
}

// =============== MOCK AUDIT LOGS ===============

export const mockAuditLogs: AuditLog[] = [
  {
    id: "log-001",
    action: "login",
    description: "Đăng nhập thành công",
    ip: "113.161.xxx.xxx",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0",
    device: "Desktop",
    browser: "Chrome 121",
    location: "Hà Nội, Việt Nam",
    createdAt: "2026-02-06T08:30:00Z",
  },
  {
    id: "log-002",
    action: "translation_complete",
    description: 'Dịch hoàn tất "báo cáo Q4.pdf"',
    ip: "113.161.xxx.xxx",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0",
    device: "Desktop",
    browser: "Chrome 121",
    location: "Hà Nội, Việt Nam",
    createdAt: "2026-02-05T14:35:00Z",
  },
  {
    id: "log-003",
    action: "credit_purchase",
    description: "Nạp 500 credits qua VNPay",
    ip: "113.161.xxx.xxx",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0",
    device: "Desktop",
    browser: "Chrome 121",
    location: "Hà Nội, Việt Nam",
    createdAt: "2026-02-06T09:00:00Z",
  },
  {
    id: "log-004",
    action: "settings_change",
    description: "Thay đổi ngôn ngữ giao diện",
    ip: "115.73.xxx.xxx",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/605.1",
    device: "Mobile",
    browser: "Safari",
    location: "TP. Hồ Chí Minh, Việt Nam",
    createdAt: "2026-02-04T15:20:00Z",
  },
  {
    id: "log-005",
    action: "login",
    description: "Đăng nhập từ thiết bị mới",
    ip: "115.73.xxx.xxx",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/605.1",
    device: "Mobile",
    browser: "Safari",
    location: "TP. Hồ Chí Minh, Việt Nam",
    createdAt: "2026-02-01T09:00:00Z",
  },
]

// =============== PROVIDER OPTIONS ===============

export const authProviderOptions = [
  { id: "google", name: "Google", icon: "Google", color: "#EA4335" },
  { id: "facebook", name: "Facebook", icon: "Facebook", color: "#1877F2" },
  { id: "github", name: "GitHub", icon: "Github", color: "#333333" },
] as const
