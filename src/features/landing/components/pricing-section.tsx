"use client"

import { useRef } from "react"
import { useTranslations } from "next-intl"
import { motion, useInView } from "framer-motion"
import { Coins } from "lucide-react"
import { cn } from "@/lib/utils"

// Import shared components and data
import { PricingGrid, EnterpriseBlock } from "@/features/pricing"

export interface PricingSectionProps {
  className?: string
}

export function PricingSection({ className }: PricingSectionProps) {
  const t = useTranslations("marketing.pricingSection")
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="pricing"
      ref={ref}
      className={cn("relative py-20 lg:py-32 overflow-hidden", className)}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 via-background to-secondary-50/20 dark:from-primary-900/10 dark:via-background dark:to-secondary-900/5" />

      {/* Decorative blobs */}
      <div className="absolute top-40 left-10 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl dark:bg-primary-800/15" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary-200/30 rounded-full blur-3xl dark:bg-secondary-800/10" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--primary-500)_1px,transparent_0)] bg-[size:48px_48px] opacity-[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
            {t("title")}
            <br />
            <span className="text-primary">{t("subtitle")}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* Pricing Cards - Using shared component */}
        <PricingGrid />

        {/* Enterprise Block - Using shared component */}
        <EnterpriseBlock variant="dark" className="mt-16" />
      </div>
    </section>
  )
}
