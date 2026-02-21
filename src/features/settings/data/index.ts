// =====================================================================
// SETTINGS MOCK DATA — aligned with backend API types
// =====================================================================

import type {
  UserProfile,
  UserPreferences,
  AuthIdentity,
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
  { id: "profile", label: "Ho\u0300 s\u01A1", icon: "User", description: "Th\u00F4ng tin c\u00E1 nh\u00E2n" },
  { id: "preferences", label: "T\u00F9y cho\u0323n", icon: "Settings", description: "C\u00E0i \u0111\u1EB7t h\u1EC7 th\u1ED1ng" },
  { id: "security", label: "B\u1EA3o m\u1EADt", icon: "Shield", description: "M\u1EADt kh\u1EA9u & \u0111\u0103ng nh\u1EADp" },
  { id: "notifications", label: "Th\u00F4ng b\u00E1o", icon: "Bell", description: "Qu\u1EA3n l\u00FD th\u00F4ng b\u00E1o" },
  { id: "billing", label: "Thanh to\u00E1n", icon: "CreditCard", description: "Credits & giao d\u1ECBch" },
  { id: "files", label: "T\u1EC7p", icon: "FolderOpen", description: "Qu\u1EA3n l\u00FD t\u1EC7p" },
  { id: "activity", label: "Ho\u1EA1t \u0111\u1ED9ng", icon: "History", description: "Nh\u1EADt k\u00FD ho\u1EA1t \u0111\u1ED9ng" },
]

// =============== LANGUAGE OPTIONS ===============

export const uiLanguageOptions = [
  { value: "vi", label: "Ti\u1EBFng Vi\u1EC7t", flag: "\uD83C\uDDFB\uD83C\uDDF3" },
  { value: "en", label: "English", flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  { value: "ja", label: "\u65E5\u672C\u8A9E", flag: "\uD83C\uDDEF\uD83C\uDDF5" },
  { value: "ko", label: "\uD55C\uAD6D\uC5B4", flag: "\uD83C\uDDF0\uD83C\uDDF7" },
  { value: "zh", label: "\u4E2D\u6587", flag: "\uD83C\uDDE8\uD83C\uDDF3" },
] as const

export const themeOptions = [
  { value: "light", label: "S\u00E1ng", icon: "Sun" },
  { value: "dark", label: "T\u1ED1i", icon: "Moon" },
  { value: "system", label: "H\u1EC7 th\u1ED1ng", icon: "Monitor" },
] as const

export const fileTtlOptions = [
  { value: 10080, label: "7 ngày" },
  { value: 20160, label: "14 ngày" },
  { value: 43200, label: "30 ngày" },
  { value: 86400, label: "60 ngày" },
  { value: 129600, label: "90 ngày" },
] as const

// =============== MOCK USER PROFILE ===============

export const mockUserProfile: UserProfile = {
  id: "user-001",
  email: "nguyenvana@gmail.com",
  fullName: "Nguy\u1EC5n V\u0103n A",
  phone: "+84 912 345 678",
  avatarUrl: null,
  emailVerified: true,
  isOAuthUser: false,
  createdAt: "2024-01-15T10:00:00Z",
  lastLoginAt: "2026-02-06T08:30:00Z",
}

// =============== MOCK PREFERENCES ===============

export const mockUserPreferences: UserPreferences = {
  uiLanguage: "vi",
  theme: "dark",
  fileTtl: 10080,
}

// =============== MOCK AUTH IDENTITIES ===============

export const mockAuthIdentities: AuthIdentity[] = [
  {
    id: "auth-001",
    provider: "credentials",
    email: "nguyenvana@gmail.com",
    linkedAt: "2024-01-15T10:00:00Z",
    canUnlink: false,
  },
  {
    id: "auth-002",
    provider: "google",
    email: "nguyenvana@gmail.com",
    linkedAt: "2025-06-20T14:30:00Z",
    canUnlink: true,
  },
]

// =============== MOCK NOTIFICATIONS ===============

export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    type: "translation_complete",
    title: "D\u1ECBch ho\u00E0n t\u1EA5t",
    message: 'T\u00E0i li\u1EC7u "b\u00E1o c\u00E1o Q4.pdf" \u0111\u00E3 \u0111\u01B0\u1EE3c d\u1ECBch xong.',
    data: { jobId: "job-123", fileName: "b\u00E1o c\u00E1o Q4.pdf" },
    isRead: false,
    readAt: null,
    createdAt: "2026-02-06T10:25:00Z",
  },
  {
    id: "notif-002",
    type: "credit_purchase",
    title: "N\u1EA1p credits th\u00E0nh c\u00F4ng",
    message: "B\u1EA1n \u0111\u00E3 n\u1EA1p th\u00E0nh c\u00F4ng 500 credits v\u00E0o t\u00E0i kho\u1EA3n.",
    isRead: false,
    readAt: null,
    createdAt: "2026-02-06T09:00:00Z",
  },
  {
    id: "notif-003",
    type: "file_expiring",
    title: "File s\u1EAFp h\u1EBFt h\u1EA1n",
    message: "3 file s\u1EBD h\u1EBFt h\u1EA1n l\u01B0u tr\u1EEF trong 7 ng\u00E0y t\u1EDBi.",
    isRead: true,
    readAt: "2026-02-04T09:00:00Z",
    createdAt: "2026-02-04T08:00:00Z",
  },
  {
    id: "notif-004",
    type: "security_alert",
    title: "\u0110\u0103ng nh\u1EADp m\u1EDBi",
    message: "Ph\u00E1t hi\u1EC7n \u0111\u0103ng nh\u1EADp t\u1EEB thi\u1EBFt b\u1ECB m\u1EDBi t\u1EA1i TP.HCM.",
    isRead: true,
    readAt: "2026-02-01T15:00:00Z",
    createdAt: "2026-02-01T14:30:00Z",
  },
]

export const mockNotificationPreferences: NotificationPreference[] = [
  {
    type: "translation_complete",
    label: "D\u1ECBch ho\u00E0n t\u1EA5t",
    description: "Th\u00F4ng b\u00E1o khi t\u00E0i li\u1EC7u \u0111\u01B0\u1EE3c d\u1ECBch xong",
    emailEnabled: true,
    pushEnabled: true,
  },
  {
    type: "credit_purchase",
    label: "N\u1EA1p credits",
    description: "Th\u00F4ng b\u00E1o khi n\u1EA1p credits th\u00E0nh c\u00F4ng",
    emailEnabled: true,
    pushEnabled: false,
  },
  {
    type: "file_expiring",
    label: "File s\u1EAFp h\u1EBFt h\u1EA1n",
    description: "Nh\u1EAFc nh\u1EDF khi file s\u1EAFp b\u1ECB x\u00F3a",
    emailEnabled: true,
    pushEnabled: true,
  },
  {
    type: "security_alert",
    label: "C\u1EA3nh b\u00E1o b\u1EA3o m\u1EADt",
    description: "\u0110\u0103ng nh\u1EADp t\u1EEB thi\u1EBFt b\u1ECB m\u1EDBi, thay \u0111\u1ED5i m\u1EADt kh\u1EA9u",
    emailEnabled: true,
    pushEnabled: true,
  },
  {
    type: "promotion",
    label: "Khuy\u1EBFn m\u00E3i",
    description: "\u01AFu \u0111\u00E3i v\u00E0 ch\u01B0\u01A1ng tr\u00ECnh khuy\u1EBFn m\u00E3i",
    emailEnabled: false,
    pushEnabled: false,
  },
]

// =============== MOCK WALLET & BILLING ===============

export const mockWallet: Wallet = {
  id: "wallet-001",
  balance: 1250,
  updatedAt: "2026-02-06T09:00:00Z",
}

export const mockWalletLedger: WalletLedger[] = [
  {
    id: "ledger-001",
    ledgerType: "topup",
    delta: 500,
    refTable: "payments",
    refId: "payment-001",
    note: "N\u1EA1p g\u00F3i 500 Credits",
    createdAt: "2026-02-06T09:00:00Z",
  },
  {
    id: "ledger-002",
    ledgerType: "spend",
    delta: -25,
    refTable: "translation_jobs",
    refId: "job-123",
    note: 'D\u1ECBch t\u00E0i li\u1EC7u "b\u00E1o c\u00E1o Q4.pdf"',
    createdAt: "2026-02-05T14:30:00Z",
  },
  {
    id: "ledger-003",
    ledgerType: "spend",
    delta: -50,
    refTable: "translation_jobs",
    refId: "job-122",
    note: 'D\u1ECBch t\u00E0i li\u1EC7u "h\u1EE3p \u0111\u1ED3ng.docx"',
    createdAt: "2026-02-03T10:15:00Z",
  },
  {
    id: "ledger-004",
    ledgerType: "topup",
    delta: 100,
    refTable: "bonuses",
    refId: "bonus-001",
    note: "Th\u01B0\u1EDFng \u0111\u0103ng k\u00FD t\u00E0i kho\u1EA3n",
    createdAt: "2026-01-15T10:00:00Z",
  },
]

export const mockPayments: Payment[] = [
  {
    id: "payment-001",
    provider: "vnpay",
    providerPaymentId: "VNP123456",
    amount: 450000,
    currency: "vnd",
    status: "succeeded",
    createdAt: "2026-02-06T08:55:00Z",
    paidAt: "2026-02-06T09:00:00Z",
    package: { id: "pkg-002", name: "Professional", credits: 500 },
  },
  {
    id: "payment-002",
    provider: "vnpay",
    providerPaymentId: "VNP789012",
    amount: 99000,
    currency: "vnd",
    status: "succeeded",
    createdAt: "2026-01-20T11:00:00Z",
    paidAt: "2026-01-20T11:02:00Z",
    package: { id: "pkg-001", name: "Starter", credits: 100 },
  },
]

export const mockCreditPackages: CreditPackage[] = [
  {
    id: "pkg-001",
    name: "Starter",
    description: ["500 credits", "Valid for 1 year", "Email support"],
    credits: 500,
    price: 99000,
    currency: "vnd",
    type: "personal",
    active: true,
    bonus: null,
    discount: null,
    tags: [],
  },
  {
    id: "pkg-002",
    name: "Professional",
    description: ["2,000 credits", "Valid for 1 year", "Priority support"],
    credits: 2000,
    price: 349000,
    currency: "vnd",
    type: "personal",
    active: true,
    bonus: 10,
    discount: null,
    tags: ["popular"],
  },
  {
    id: "pkg-003",
    name: "Business",
    description: ["5,000 credits", "Valid for 1 year", "Dedicated support"],
    credits: 5000,
    price: 799000,
    currency: "vnd",
    type: "personal",
    active: true,
    bonus: 15,
    discount: 10,
    tags: ["best-value"],
  },
]

// =============== MOCK FILES ===============

export const mockUserFiles: UserFile[] = [
  {
    id: "file-001",
    name: "b\u00E1o c\u00E1o Q4.pdf",
    mime: "application/pdf",
    sizeBytes: 2621440,
    type: "doc",
    status: "parsed",
    createdAt: "2026-02-05T14:00:00Z",
    storeUntil: "2026-03-07T14:00:00Z",
  },
  {
    id: "file-002",
    name: "h\u1EE3p \u0111\u1ED3ng d\u1ECBch v\u1EE5.docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    sizeBytes: 1258291,
    type: "doc",
    status: "parsed",
    createdAt: "2026-02-03T10:00:00Z",
    storeUntil: "2026-03-05T10:00:00Z",
  },
  {
    id: "file-003",
    name: "thuy\u1EBFt tr\u00ECnh s\u1EA3n ph\u1EA9m.pptx",
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    sizeBytes: 5242880,
    type: "doc",
    status: "parsed",
    createdAt: "2026-02-01T09:00:00Z",
    storeUntil: "2026-02-09T09:00:00Z",
  },
  {
    id: "file-004",
    name: "t\u00E0i li\u1EC7u k\u1EF9 thu\u1EADt.pdf",
    mime: "application/pdf",
    sizeBytes: 3145728,
    type: "doc",
    status: "parsed",
    createdAt: "2026-01-25T16:00:00Z",
    storeUntil: "2026-02-24T16:00:00Z",
  },
]

export const mockStorageUsage: StorageUsage = {
  used: 2.4,
  total: 10.0,
  unit: "GB",
  percentage: 24,
  fileCount: 15,
  breakdown: {
    documents: { count: 10, size: 1.8 },
    subtitles: { count: 5, size: 0.6 },
  },
}

// =============== MOCK AUDIT LOGS ===============

export const mockAuditLogs: AuditLog[] = [
  {
    id: "log-001",
    action: "login",
    description: "\u0110\u0103ng nh\u1EADp th\u00E0nh c\u00F4ng",
    ip: "113.161.xxx.xxx",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0",
    device: "Windows PC",
    browser: "Chrome 121",
    location: "H\u00E0 N\u1ED9i, Vi\u1EC7t Nam",
    createdAt: "2026-02-06T08:30:00Z",
  },
  {
    id: "log-002",
    action: "translation_complete",
    description: 'D\u1ECBch ho\u00E0n t\u1EA5t "b\u00E1o c\u00E1o Q4.pdf"',
    ip: "113.161.xxx.xxx",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0",
    device: "Windows PC",
    browser: "Chrome 121",
    location: "H\u00E0 N\u1ED9i, Vi\u1EC7t Nam",
    createdAt: "2026-02-05T14:35:00Z",
  },
  {
    id: "log-003",
    action: "credit_purchase",
    description: "N\u1EA1p 500 credits qua VNPay",
    ip: "113.161.xxx.xxx",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0",
    device: "Windows PC",
    browser: "Chrome 121",
    location: "H\u00E0 N\u1ED9i, Vi\u1EC7t Nam",
    createdAt: "2026-02-06T09:00:00Z",
  },
  {
    id: "log-004",
    action: "settings_change",
    description: "Thay \u0111\u1ED5i ng\u00F4n ng\u1EEF giao di\u1EC7n",
    ip: "115.73.xxx.xxx",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/605.1",
    device: "iPhone 15",
    browser: "Safari 17",
    location: "TP. H\u1ED3 Ch\u00ED Minh, Vi\u1EC7t Nam",
    createdAt: "2026-02-04T15:20:00Z",
  },
  {
    id: "log-005",
    action: "login",
    description: "\u0110\u0103ng nh\u1EADp t\u1EEB thi\u1EBFt b\u1ECB m\u1EDBi",
    ip: "115.73.xxx.xxx",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/605.1",
    device: "iPhone 15",
    browser: "Safari 17",
    location: "TP. H\u1ED3 Ch\u00ED Minh, Vi\u1EC7t Nam",
    createdAt: "2026-02-01T09:00:00Z",
  },
]

// =============== PROVIDER OPTIONS ===============

export const authProviderOptions = [
  { id: "google", name: "Google", icon: "Google", color: "#EA4335" },
] as const
