"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Building2, ArrowRight, Zap, Shield, Headphones, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { enterpriseFeatures } from "@/data/pricing"

const featureIcons = [Zap, Shield, Headphones, Settings]

export interface EnterpriseBlockProps {
  className?: string
  variant?: "dark" | "light"
}

export function EnterpriseBlock({
  className,
  variant = "dark",
}: EnterpriseBlockProps) {
  const t = useTranslations("marketing.pricingPage.enterpriseSection")
  const isDark = variant === "dark"

  return (
    <div className={className}>
      <div
        className={cn(
          "relative rounded-3xl p-8 md:p-12 overflow-hidden",
          isDark ? "bg-foreground" : "bg-card border border-border"
        )}
      >
        {/* Background Pattern */}
        <div
          className={cn(
            "absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]",
            !isDark && "opacity-50"
          )}
        />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                isDark ? "bg-primary" : "bg-primary/10"
              )}
            >
              <Building2
                className={cn(
                  "w-8 h-8",
                  isDark ? "text-primary-foreground" : "text-primary"
                )}
              />
            </div>
            <div>
              <h3
                className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-background" : "text-foreground"
                )}
              >
                {t("enterpriseTitle")}
              </h3>
              <p
                className={cn(
                  "mt-1",
                  isDark ? "text-muted" : "text-muted-foreground"
                )}
              >
                {t("enterpriseDesc")}
              </p>
            </div>
          </div>

          <Button
            size="lg"
            variant="secondary"
            className={cn(
              "shadow-xl group",
              isDark
                ? "bg-background text-foreground hover:bg-muted"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            asChild
          >
            <Link href="/contact" className="flex items-center gap-2">
              {t("contactSales")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Features for pricing page variant */}
        {!isDark && (
          <div className="relative mt-8 pt-8 border-t border-border">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {enterpriseFeatures.map((feature, idx) => {
                const Icon = featureIcons[idx]
                return (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
