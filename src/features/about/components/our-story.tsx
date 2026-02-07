"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { missionVision, type MissionVisionItem } from "../data"

interface MissionVisionCardProps {
  item: MissionVisionItem
  title: string
  description: string
}

function MissionVisionCard({ item, title, description }: MissionVisionCardProps) {
  const Icon = item.icon

  return (
    <div
      className={cn(
        "relative p-8 rounded-2xl border transition-colors duration-300",
        "bg-card hover:shadow-lg",
        item.id === "mission"
          ? "border-primary/20 hover:border-primary/40"
          : "border-secondary/20 hover:border-secondary/40"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
          item.id === "mission"
            ? "bg-primary/10 text-primary"
            : "bg-secondary/10 text-secondary-600 dark:text-secondary"
        )}
      >
        <Icon className="w-7 h-7" />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-foreground mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

export interface OurStoryProps {
  className?: string
}

export function OurStory({ className }: OurStoryProps) {
  const t = useTranslations("marketing.about")

  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("story.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("story.subtitle")}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {missionVision.map((item) => (
            <MissionVisionCard
              key={item.id}
              item={item}
              title={t(`${item.id}.title`)}
              description={t(`${item.id}.description`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
