"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { mainNavItems, type NavItem } from "@/data/navigation"
import { siteConfig } from "@/data/site"

export type { NavItem }

export interface HeaderProps {
  logo?: {
    text: string
    icon?: string
    href?: string
  }
  navItems?: NavItem[]
  ctaButton?: {
    label: string
    href: string
    showIcon?: boolean
  }
  loginButton?: {
    label: string
    href: string
  }
}

export function Header({
  logo = { text: siteConfig.name, icon: "A", href: "/" },
  navItems = mainNavItems,
  ctaButton = { label: "Bắt đầu miễn phí", href: "/register", showIcon: true },
  loginButton = { label: "Đăng nhập", href: "/login" },
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg shadow-primary/5 border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href={logo.href || "/"} className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md"
              >
                <span className="text-primary-foreground font-bold text-lg">
                  {logo.icon || logo.text.charAt(0)}
                </span>
              </motion.div>
              <span className="font-bold text-xl text-primary">
                {logo.text}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href={loginButton.href}>{loginButton.label}</Link>
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild>
                  <Link href={ctaButton.href} className="flex items-center gap-1">
                    {ctaButton.label}
                    {ctaButton.showIcon && <ChevronRight className="w-4 h-4" />}
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-primary-50 dark:hover:bg-primary-900"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-background/98 backdrop-blur-lg shadow-xl border-b border-border mx-4 rounded-2xl mt-2 overflow-hidden">
              <nav className="flex flex-col p-4 gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-foreground hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900 rounded-xl transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-border mt-2 pt-4 flex flex-col gap-2">
                  <Button variant="ghost" className="justify-center" asChild>
                    <Link href={loginButton.href}>{loginButton.label}</Link>
                  </Button>
                  <Button asChild>
                    <Link href={ctaButton.href} className="flex items-center justify-center gap-1">
                      {ctaButton.label}
                      {ctaButton.showIcon && <ChevronRight className="w-4 h-4" />}
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
