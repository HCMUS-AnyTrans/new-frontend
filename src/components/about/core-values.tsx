"use client"

import { useTranslations } from "next-intl"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { coreValues, type CoreValue } from "@/data/about"

interface ValueCardProps {
  value: CoreValue
  title: string
  description: string
}

function ValueCard({ value, title, description }: ValueCardProps) {
  const Icon = value.icon

  return (
    <div
      className={cn(
        "group relative p-6 lg:p-8 rounded-2xl border border-border bg-card",
        "hover:shadow-lg hover:border-primary/30 transition-colors duration-300",
        value.gridClass
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

export interface CoreValuesProps {
  className?: string
}

export function CoreValues({ className }: CoreValuesProps) {
  const t = useTranslations("marketing.about.values")

  // Map value ids to translation keys
  const valueKeys: Record<string, string> = {
    innovation: "innovation",
    quality: "quality",
    customer: "customer",
    teamwork: "teamwork",
  }

  return (
    <section
      className={cn(
        "relative py-20 lg:py-28 overflow-hidden",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30 dark:bg-muted/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {coreValues.map((value) => (
            <ValueCard
              key={value.id}
              value={value}
              title={t(`${valueKeys[value.id]}.title`)}
              description={t(`${valueKeys[value.id]}.description`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
