// ============================================================================
// NAVIGATION DATA - Source of Truth
// ============================================================================

export interface NavItem {
  label: string
  href: string
}

export interface NavConfig {
  mainNav: NavItem[]
  footerNav: Record<string, { title: string; links: NavItem[] }>
}

// Main navigation links
export const mainNavItems: NavItem[] = [
  { label: "Tính năng", href: "#features" },
  { label: "Cách hoạt động", href: "#how-it-works" },
  { label: "Bảng giá", href: "#pricing" },
  { label: "Đánh giá", href: "#testimonials" },
]

// Footer navigation sections
export const footerNavSections: Record<string, { title: string; links: NavItem[] }> = {
  product: {
    title: "Sản phẩm",
    links: [
      { label: "Tính năng", href: "#features" },
      { label: "Bảng giá", href: "/pricing" },
      { label: "API", href: "/api" },
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  company: {
    title: "Công ty",
    links: [
      { label: "Về chúng tôi", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Tuyển dụng", href: "/careers" },
      { label: "Liên hệ", href: "/contact" },
      { label: "Đối tác", href: "/partners" },
    ],
  },
  resources: {
    title: "Tài nguyên",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Hướng dẫn", href: "/guides" },
      { label: "Video tutorials", href: "/tutorials" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Hỗ trợ", href: "/support" },
    ],
  },
  legal: {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản", href: "/terms" },
      { label: "Bảo mật", href: "/privacy" },
      { label: "Cookie", href: "/cookies" },
      { label: "DMCA", href: "/dmca" },
    ],
  },
}
