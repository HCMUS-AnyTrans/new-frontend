"use client"

import { useTranslations } from "next-intl"
import { HeroBackground } from "@/components/shared"

export interface ContactHeroProps {
  className?: string
}

export function ContactHero({ className }: ContactHeroProps) {
  const t = useTranslations("marketing.contact.hero")

  return (
    <HeroBackground
      padding="pt-28 pb-12 lg:pt-32 lg:pb-16"
      className={className}
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
          {t("title")}{" "}
          <span className="text-primary">{t("titleHighlight")}</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          {t("description")}
        </p>
      </div>
    </HeroBackground>
  )
}
