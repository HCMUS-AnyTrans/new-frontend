"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface BannerCTAProps {
  className?: string
  /** Main heading text */
  title?: string
  /** Optional subtitle/description */
  subtitle?: string
  /** Primary button text */
  primaryButtonText?: string
  /** Primary button link */
  primaryButtonHref?: string
  /** Secondary button text */
  secondaryButtonText?: string
  /** Secondary button link */
  secondaryButtonHref?: string
  /** Show decorative blur elements (default: true) */
  showDecorations?: boolean
}

/**
 * Reusable CTA Banner component with gradient background and decorative elements.
 * Used across pricing, about, and other marketing pages.
 * 
 * @example
 * <BannerCTA 
 *   title="Ready to get started?"
 *   subtitle="Join thousands of customers"
 *   primaryButtonText="Try for free"
 *   secondaryButtonText="Contact sales"
 * />
 */
export function BannerCTA({
  className,
  title,
  subtitle,
  primaryButtonText,
  primaryButtonHref = "/register",
  secondaryButtonText,
  secondaryButtonHref = "/contact",
  showDecorations = true,
}: BannerCTAProps) {
  const t = useTranslations("marketing.cta")

  // Use provided props or fall back to translations
  const displayTitle = title ?? t("title")
  const displaySubtitle = subtitle ?? t("subtitle")
  const displayPrimaryText = primaryButtonText ?? t("primaryButton")
  const displaySecondaryText = secondaryButtonText ?? t("secondaryButton")

  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-700 dark:from-primary-600 dark:to-primary-900 p-8 lg:p-16 text-center">
          {/* Decorative elements */}
          {showDecorations && (
            <>
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            </>
          )}

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              {displayTitle}
            </h2>
            {displaySubtitle && (
              <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                {displaySubtitle}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 h-14 text-lg font-semibold group"
                asChild
              >
                <Link href={primaryButtonHref} className="flex items-center gap-2">
                  {displayPrimaryText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 h-14 text-lg font-semibold bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href={secondaryButtonHref}>{displaySecondaryText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
