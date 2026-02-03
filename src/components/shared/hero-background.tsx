import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroBackgroundProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
  /** Show decorative shape on the right side (default: true) */
  showDecorativeShape?: boolean
  /** Show grid pattern overlay (default: true) */
  showGridPattern?: boolean
  /** Additional padding classes */
  padding?: string
}

/**
 * Reusable Hero Background component with 3-layer design:
 * 1. Base color layer (primary-50 / dark:background)
 * 2. Decorative shape (optional, right side)
 * 3. Grid pattern overlay (optional)
 */
export const HeroBackground = React.forwardRef<HTMLElement, HeroBackgroundProps>(
  (
    {
      children,
      className,
      showDecorativeShape = true,
      showGridPattern = true,
      padding = "pt-32 pb-16 px-4",
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn("relative overflow-hidden", padding, className)}
        {...props}
      >
        {/* Background Layer 1: Base color */}
        <div className="absolute inset-0 bg-primary-50 dark:bg-background" />

        {/* Background Layer 2: Decorative shape */}
        {showDecorativeShape && (
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-100 dark:bg-primary-900/20 rounded-bl-[100px] hidden lg:block" />
        )}

        {/* Background Layer 3: Grid pattern */}
        {showGridPattern && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary-500)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-500)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />
        )}

        {/* Content - renders children directly without extra wrapper when using flex layout */}
        {children}
      </section>
    )
  }
)

HeroBackground.displayName = "HeroBackground"
