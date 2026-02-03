import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface PricingCTAProps {
  className?: string
  title?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
}

export function PricingCTA({
  className,
  title = "Sẵn sàng dịch nhanh hơn 10 lần?",
  primaryButtonText = "Bắt đầu miễn phí",
  primaryButtonHref = "/register",
  secondaryButtonText = "Xem demo",
  secondaryButtonHref = "/demo",
}: PricingCTAProps) {
  return (
    <section
      className={cn(
        "py-20 px-4 bg-gradient-to-r from-primary-800 to-primary-900 dark:from-primary-900 dark:to-background rounded-3xl",
        className
      )}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground dark:text-foreground mb-8">
          {title}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl px-8 h-14 text-lg group"
            asChild
          >
            <Link href={primaryButtonHref} className="flex items-center gap-2">
              {primaryButtonText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent px-8 h-14 text-lg dark:border-border dark:text-foreground dark:hover:bg-card"
            asChild
          >
            <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
