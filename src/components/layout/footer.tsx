"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  footerNavSections,
  bottomLinks as defaultBottomLinks,
  type FooterSection,
  type NavItem,
} from "@/data/navigation"
import {
  siteConfig,
  contactInfo as defaultContactInfo,
  socialLinks as defaultSocialLinks,
  type SocialLink,
  type ContactInfo,
} from "@/data/site"

// Re-export types for external use
export type FooterLink = NavItem
export type { FooterSection, SocialLink, ContactInfo }

export interface FooterProps {
  className?: string
  logo?: {
    text: string
    icon?: string
    href?: string
  }
  description?: string
  sections?: Record<string, FooterSection>
  socialLinks?: SocialLink[]
  contactInfo?: ContactInfo
  copyright?: string
  bottomLinks?: NavItem[]
}

// --- Sub-components ---

interface FooterLinkColumnProps {
  section: FooterSection
}

function FooterLinkColumn({ section }: FooterLinkColumnProps) {
  return (
    <div>
      <h4 className="font-semibold text-white mb-4">{section.title}</h4>
      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-[hsl(215,16%,70%)] hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface SocialButtonProps {
  social: SocialLink
}

function SocialButton({ social }: SocialButtonProps) {
  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2 }}
      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[hsl(215,16%,70%)] hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors"
      aria-label={social.label}
    >
      <social.icon className="w-5 h-5" />
    </motion.a>
  )
}

// --- Main Component ---

export function Footer({
  className,
  logo = { text: siteConfig.name, icon: "A", href: "/" },
  description = siteConfig.description,
  sections = footerNavSections,
  socialLinks = defaultSocialLinks,
  contactInfo = defaultContactInfo,
  copyright,
  bottomLinks = defaultBottomLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const copyrightText =
    copyright || `© ${currentYear} ${logo.text}. All rights reserved.`

  return (
    <footer
      className={cn(
        "relative bg-[hsl(222,47%,11%)] text-white overflow-hidden",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link
                href={logo.href || "/"}
                className="inline-flex items-center gap-2 group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-10 h-10"
                >
                  <Image
                    src="/logo.svg"
                    alt={logo.text}
                    fill
                    className="object-contain"
                  />
                </motion.div>
                <span className="font-bold text-xl text-white">{logo.text}</span>
              </Link>

              <p className="mt-4 text-[hsl(215,16%,70%)] leading-relaxed max-w-xs">
                {description}
              </p>

              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-3 text-sm text-[hsl(215,16%,70%)] hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {contactInfo.email}
                  </a>
                )}
                {contactInfo.phone && (
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-[hsl(215,16%,70%)] hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {contactInfo.phone}
                  </a>
                )}
                {contactInfo.address && (
                  <div className="flex items-start gap-3 text-sm text-[hsl(215,16%,70%)]">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{contactInfo.address}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-6 flex gap-3">
                {socialLinks.map((social) => (
                  <SocialButton key={social.label} social={social} />
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(sections).map(([key, section]) => (
              <FooterLinkColumn key={key} section={section} />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[hsl(215,16%,50%)]">{copyrightText}</p>
            <div className="flex items-center gap-6">
              {bottomLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[hsl(215,16%,50%)] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
