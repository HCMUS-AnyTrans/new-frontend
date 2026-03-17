import {
  LayoutDashboard,
  FileText,
  BookOpen,
  History,
  Settings,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// ============================================================================
// NAVIGATION CONFIG
// ============================================================================

export const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Dịch tài liệu',
    href: '/documents',
    icon: FileText,
  },
  {
    title: 'Từ điển thuật ngữ',
    href: '/glossary',
    icon: BookOpen,
  },
  {
    title: 'Lịch sử',
    href: '/history',
    icon: History,
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    title: 'Cài đặt',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Trợ giúp',
    href: '/help',
    icon: HelpCircle,
  },
];

export const navGroups: NavGroup[] = [
  {
    label: 'Menu chính',
    items: mainNavItems,
  },
  {
    label: 'Khác',
    items: secondaryNavItems,
  },
];

// ============================================================================
// PAGE TITLES
// ============================================================================

export const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/documents': 'Dịch tài liệu',
  '/glossary': 'Từ điển thuật ngữ',
  '/history': 'Lịch sử',
  '/settings': 'Cài đặt',
  '/help': 'Trợ giúp',
};

// ============================================================================
// LANGUAGE CONFIG
// ============================================================================

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export const languageCodeMap: Record<string, string> = {
  vi: 'VN',
  en: 'EN',
  ja: 'JP',
  ko: 'KR',
  zh: 'CN',
  fr: 'FR',
  de: 'DE',
};

// ============================================================================
// STATUS CONFIG
// ============================================================================

export interface StatusConfig {
  label: string;
  className: string;
}

export const jobStatusConfig: Record<string, StatusConfig> = {
  pending: {
    label: 'Chờ xử lý',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  processing: {
    label: 'Đang xử lý',
    className: 'bg-info/10 text-info border-info/20',
  },
  succeeded: {
    label: 'Hoàn thành',
    className: 'bg-success/10 text-success border-success/20',
  },
  failed: {
    label: 'Thất bại',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};
