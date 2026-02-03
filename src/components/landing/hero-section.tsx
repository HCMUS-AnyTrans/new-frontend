"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TrustBadge, AvatarStack, StarRating } from "@/components/shared"
import { TranslationDemo } from "./translation-demo"
import { cn } from "@/lib/utils"

export interface HeroSectionProps {
  badge?: {
    text: string
    pulse?: boolean
    variant?: "success" | "info" | "warning" | "primary"
  }
  headline?: {
    line1: string
    line2: string
  }
  subheadline?: string | React.ReactNode
  primaryCTA?: {
    label: string
    href: string
    showIcon?: boolean
  }
  secondaryCTA?: {
    label: string
    href: string
    icon?: "play" | "arrow"
  }
  stats?: {
    users: number
    rating: number
  }
  showDemo?: boolean
  className?: string
}

export function HeroSection({
  badge = {
    text: "Trusted by 10,000+ professionals",
    pulse: true,
    variant: "success",
  },
  headline = {
    line1: "Dịch tài liệu",
    line2: "chuyên nghiệp với AI",
  },
  subheadline = (
    <>
      Giữ nguyên format, hỗ trợ glossary chuyên ngành.
      <br className="hidden sm:block" />
      Dịch Word, PDF, Subtitle nhanh gấp 10 lần thủ công.
    </>
  ),
  primaryCTA = {
    label: "Bắt đầu miễn phí",
    href: "/register",
    showIcon: true,
  },
  secondaryCTA = {
    label: "Xem Demo",
    href: "/demo",
    icon: "play",
  },
  stats = {
    users: 10000,
    rating: 4.9,
  },
  showDemo = true,
  className,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const formatUsers = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(0)},000+` : `${num}+`
  }

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative min-h-screen flex items-center overflow-hidden pt-20",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-primary-50 dark:bg-background" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-100 dark:bg-primary-900/20 rounded-bl-[100px] hidden lg:block" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary-500)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-500)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div style={{ opacity }} className="text-center lg:text-left">
            {/* Badge */}
            {badge && (
              <TrustBadge
                text={badge.text}
                pulse={badge.pulse}
                variant={badge.variant}
                className="mb-6"
              />
            )}

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-balance"
            >
              <span className="text-foreground">{headline.line1}</span>
              <br />
              <span className="text-primary">{headline.line2}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty"
            >
              {subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-primary/20 text-base px-8 h-14 group"
                  asChild
                >
                  <Link href={primaryCTA.href} className="flex items-center gap-2">
                    {primaryCTA.label}
                    {primaryCTA.showIcon && (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Link>
                </Button>
              </motion.div>

              {secondaryCTA && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base px-8 h-14 group"
                    asChild
                  >
                    <Link href={secondaryCTA.href} className="flex items-center gap-2">
                      {secondaryCTA.icon === "play" && (
                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      )}
                      {secondaryCTA.label}
                      {secondaryCTA.icon === "arrow" && (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      )}
                    </Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Trust Bar */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              >
                <AvatarStack count={5} showMore size="md" />

                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
                  <span className="text-foreground font-semibold">
                    {formatUsers(stats.users)} người dùng hài lòng
                  </span>
                  <StarRating rating={stats.rating} showText />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Visual */}
          {showDemo && (
            <motion.div style={{ y, opacity }} className="relative hidden lg:block">
              <TranslationDemo />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
