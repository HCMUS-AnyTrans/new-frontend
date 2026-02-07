import {
  LayoutDashboard,
  FileText,
  Subtitles,
  BookOpen,
  History,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react"

// ============================================================================
// TYPES
// ============================================================================

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number
  disabled?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// ============================================================================
// NAVIGATION CONFIG
// ============================================================================

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Dịch tài liệu",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Dịch phụ đề",
    href: "/subtitles",
    icon: Subtitles,
  },
  {
    title: "Từ điển thuật ngữ",
    href: "/glossary",
    icon: BookOpen,
  },
  {
    title: "Lịch sử",
    href: "/history",
    icon: History,
  },
]

export const secondaryNavItems: NavItem[] = [
  {
    title: "Cài đặt",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Trợ giúp",
    href: "/help",
    icon: HelpCircle,
  },
]

export const navGroups: NavGroup[] = [
  {
    label: "Menu chính",
    items: mainNavItems,
  },
  {
    label: "Khác",
    items: secondaryNavItems,
  },
]

// ============================================================================
// PAGE TITLES
// ============================================================================

export const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/documents": "Dịch tài liệu",
  "/subtitles": "Dịch phụ đề",
  "/glossary": "Từ điển thuật ngữ",
  "/history": "Lịch sử",
  "/settings": "Cài đặt",
  "/help": "Trợ giúp",
}

// ============================================================================
// LANGUAGE CONFIG
// ============================================================================

export interface Language {
  code: string
  name: string
  flag: string
}

export const supportedLanguages: Language[] = [
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
]

export const languageCodeMap: Record<string, string> = {
  vi: "VN",
  en: "EN",
  ja: "JP",
  ko: "KR",
  zh: "CN",
  fr: "FR",
  de: "DE",
}

// ============================================================================
// STATUS CONFIG
// ============================================================================

export interface StatusConfig {
  label: string
  className: string
}

export const jobStatusConfig: Record<string, StatusConfig> = {
  pending: {
    label: "Chờ xử lý",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  processing: {
    label: "Đang xử lý",
    className: "bg-info/10 text-info border-info/20",
  },
  succeeded: {
    label: "Hoàn thành",
    className: "bg-success/10 text-success border-success/20",
  },
  failed: {
    label: "Thất bại",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

// ============================================================================
// MOCK DATA - For development
// ============================================================================

export const mockUser = {
  id: "user-001",
  fullName: "Nguyễn Văn A",
  email: "nguyen.a@email.com",
  avatarUrl: null,
  initials: "NA",
}

export const mockWallet = {
  balance: 12450,
}

export const mockStats = {
  totalCredits: 12450,
  creditsChange: "+2.100",
  creditsTrend: "up" as const,
  
  totalJobs: 156,
  documentJobs: 128,
  subtitleJobs: 28,
  jobsChange: "+23",
  jobsTrend: "up" as const,
  
  processingJobs: 4,
  processingChange: "-2",
  processingTrend: "down" as const,
  
  completedThisMonth: 38,
  completedChange: "+12",
  completedTrend: "up" as const,
  successRate: 97.4,
}

export const mockRecentJobs = [
  {
    id: "JOB-001",
    fileName: "bao_cao_tai_chinh_Q4.docx",
    jobType: "document" as const,
    srcLang: "vi",
    tgtLang: "en",
    status: "succeeded" as const,
    costCredits: 450,
    createdAt: "2026-02-06 14:30",
  },
  {
    id: "JOB-002",
    fileName: "marketing_plan_2026.pdf",
    jobType: "document" as const,
    srcLang: "en",
    tgtLang: "vi",
    status: "processing" as const,
    costCredits: 320,
    createdAt: "2026-02-06 13:15",
  },
  {
    id: "JOB-003",
    fileName: "tutorial_react_basics.srt",
    jobType: "subtitle" as const,
    srcLang: "en",
    tgtLang: "vi",
    status: "succeeded" as const,
    costCredits: 180,
    createdAt: "2026-02-05 16:45",
  },
  {
    id: "JOB-004",
    fileName: "hop_dong_doi_tac.docx",
    jobType: "document" as const,
    srcLang: "vi",
    tgtLang: "ja",
    status: "pending" as const,
    costCredits: 560,
    createdAt: "2026-02-05 10:20",
  },
  {
    id: "JOB-005",
    fileName: "phim_tai_lieu_ep3.vtt",
    jobType: "subtitle" as const,
    srcLang: "vi",
    tgtLang: "en",
    status: "failed" as const,
    costCredits: 0,
    createdAt: "2026-02-04 09:00",
  },
  {
    id: "JOB-006",
    fileName: "user_manual_v2.pdf",
    jobType: "document" as const,
    srcLang: "en",
    tgtLang: "vi",
    status: "succeeded" as const,
    costCredits: 290,
    createdAt: "2026-02-04 08:30",
  },
  {
    id: "JOB-007",
    fileName: "bai_giang_AI_intro.srt",
    jobType: "subtitle" as const,
    srcLang: "en",
    tgtLang: "vi",
    status: "succeeded" as const,
    costCredits: 210,
    createdAt: "2026-02-03 17:00",
  },
]

export const mockActivities = [
  {
    id: "act-001",
    type: "job_complete" as const,
    title: "Job hoàn thành",
    description: "bao_cao_tai_chinh_Q4.docx đã dịch xong",
    createdAt: "5 phút trước",
  },
  {
    id: "act-002",
    type: "payment" as const,
    title: "Nạp credits thành công",
    description: "Đã nạp 5.000 credits vào tài khoản",
    createdAt: "1 giờ trước",
  },
  {
    id: "act-003",
    type: "job_complete" as const,
    title: "Job hoàn thành",
    description: "tutorial_react_basics.srt đã dịch xong",
    createdAt: "3 giờ trước",
  },
  {
    id: "act-004",
    type: "warning" as const,
    title: "Credits thấp",
    description: "Credits của bạn còn 12.450. Hãy nạp thêm!",
    createdAt: "5 giờ trước",
  },
  {
    id: "act-005",
    type: "job_failed" as const,
    title: "Job thất bại",
    description: "phim_tai_lieu_ep3.vtt - File không hợp lệ",
    createdAt: "1 ngày trước",
  },
]

export const mockJobsChartData = [
  { day: "T2", document: 8, subtitle: 3 },
  { day: "T3", document: 12, subtitle: 5 },
  { day: "T4", document: 6, subtitle: 2 },
  { day: "T5", document: 15, subtitle: 7 },
  { day: "T6", document: 10, subtitle: 4 },
  { day: "T7", document: 4, subtitle: 1 },
  { day: "CN", document: 2, subtitle: 0 },
]

export const mockCreditUsageData = [
  { name: "Tài liệu", value: 8200, fill: "var(--color-chart-1)" },
  { name: "Phụ đề", value: 3800, fill: "var(--color-chart-3)" },
  { name: "Còn lại", value: 12450, fill: "var(--color-chart-2)" },
]

export const mockStorage = {
  used: 2.4,
  total: 5.0,
}
