"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { HeroBackground } from "@/components/shared"
import { aboutStats, type AboutStat } from "../data"
import { useScrollReveal, useCountUp } from "@/hooks"

interface StatCardProps {
  stat: AboutStat
  isVisible: boolean
  label: string
}

function StatCard({ stat, isVisible, label }: StatCardProps) {
  const count = useCountUp({
    end: stat.value,
    duration: 2000,
    delay: 0,
    enabled: isVisible,
    decimals: stat.value % 1 !== 0 ? 1 : 0,
  })

  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary mb-2">
        {count}
        <span className="text-primary">{stat.suffix}</span>
      </div>
      <div className="text-sm sm:text-base text-muted-foreground font-medium">
        {label}
      </div>
    </div>
  )
}

export interface AboutHeroProps {
  className?: string
}

export function AboutHero({ className }: AboutHeroProps) {
  const t = useTranslations("marketing.about.hero")
  const tStats = useTranslations("marketing.about.stats")
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  })

  // Map stat labels to translation keys
  const statLabels = ["customers", "pages", "languages", "accuracy"]

  return (
    <HeroBackground
      padding="py-20 lg:py-32 pt-28"
      className={className}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
            {t("title")}
            <br />
            <span className="text-primary">{t("subtitle")}</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {aboutStats.map((stat, index) => (
            <StatCard
              key={statLabels[index]}
              stat={stat}
              isVisible={isVisible}
              label={tStats(statLabels[index])}
            />
          ))}
        </div>
      </div>
    </HeroBackground>
  )
}
