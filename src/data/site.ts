import { Facebook, Twitter, Linkedin, Youtube, LucideIcon } from "lucide-react"

// ============================================================================
// TYPES
// ============================================================================

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
}

export interface SocialLink {
  icon: LucideIcon
  href: string
  label: string
}

// ============================================================================
// SITE METADATA - Source of Truth
// ============================================================================

export const siteConfig: SiteConfig = {
  name: "AnyTrans",
  description:
    "Dịch tài liệu chuyên nghiệp giữ nguyên format với sức mạnh AI. Nhanh, chính xác, tiết kiệm.",
  url: "https://anytrans.ai",
  ogImage: "https://anytrans.ai/og.jpg",
  links: {
    twitter: "https://twitter.com/anytrans",
    github: "https://github.com/anytrans",
  },
}

export const contactInfo: ContactInfo = {
  email: "hello@anytrans.ai",
  phone: "+84 123 456 789",
  address: "123 Nguyen Hue, District 1, HCMC",
}

export const socialLinks: SocialLink[] = [
  { icon: Facebook, href: "https://facebook.com/anytrans", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/anytrans", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/anytrans", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@anytrans", label: "YouTube" },
]
