"use client"

import { useRef } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TrustBadge, AvatarStack, StarRating, HeroBackground } from "@/components/shared"
import { TranslationDemo } from "./translation-demo"
import { cn } from "@/lib/utils"

export interface HeroSectionProps {
  stats?: {
    users: number
    rating: number
  }
  showDemo?: boolean
  className?: string
}

export function HeroSection({
  stats = {
    users: 10000,
    rating: 4.9,
  },
  showDemo = true,
  className,
}: HeroSectionProps) {
  const t = useTranslations("marketing.hero")
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const formatUsers = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(0)},000` : `${num}`
  }

  return (
    <HeroBackground
      ref={containerRef}
      padding="pt-20"
      className={cn("min-h-screen flex items-center", className)}
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div style={{ opacity }} className="text-center lg:text-left">
            {/* Badge */}
            <TrustBadge
              text={t("badge")}
              pulse={true}
              variant="success"
              className="mb-6"
            />

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-balance"
            >
              <span className="text-foreground">{t("title")}</span>
              <br />
              <span className="text-primary">{t("subtitle")}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty"
            >
              {t("description")}
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
                  <Link href="/register" className="flex items-center gap-2">
                    {t("cta")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8 h-14 group"
                  asChild
                >
                  <Link href="/demo" className="flex items-center gap-2">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {t("ctaSecondary")}
                  </Link>
                </Button>
              </motion.div>
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
                    {t("users", { count: formatUsers(stats.users) })}
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
    </HeroBackground>
  )
}
