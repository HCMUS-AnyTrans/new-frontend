import { cn } from "@/lib/utils"

export type GridSize = "sm" | "md" | "lg"
export type BackgroundVariant = "transparent" | "solid" | "gradient" | "dark"
export type GridColor = "primary" | "white"

export interface SectionBackgroundProps {
  children: React.ReactNode
  className?: string
  
  /** Background variant */
  background?: BackgroundVariant
  
  /** Show grid pattern overlay */
  showGrid?: boolean
  
  /** Grid cell size: sm=32px, md=40px, lg=64px */
  gridSize?: GridSize
  
  /** Grid line color */
  gridColor?: GridColor
  
  /** Grid opacity (0.01 - 0.1) */
  gridOpacity?: number
  
  /** Additional padding classes */
  padding?: string
  
  /** HTML element id */
  id?: string
}

const gridSizeMap: Record<GridSize, string> = {
  sm: "32px_32px",
  md: "40px_40px",
  lg: "64px_64px",
}

const gridColorMap: Record<GridColor, string> = {
  primary: "var(--primary-500)",
  white: "rgba(255,255,255,0.05)",
}

const backgroundVariantMap: Record<BackgroundVariant, string> = {
  transparent: "",
  solid: "bg-primary-50 dark:bg-background",
  gradient: "bg-gradient-to-b from-background via-primary-50/30 to-background dark:from-background dark:via-primary-900/10 dark:to-background",
  dark: "bg-primary-900 dark:bg-primary-950",
}

/**
 * Reusable Section Background component with optional grid pattern.
 * 
 * @example
 * // Gradient background with grid (like Testimonials)
 * <SectionBackground background="gradient" showGrid gridSize="sm">
 *   <Content />
 * </SectionBackground>
 * 
 * @example
 * // Solid background with larger grid (like Features)
 * <SectionBackground background="transparent" showGrid gridSize="lg" gridOpacity={0.02}>
 *   <Content />
 * </SectionBackground>
 * 
 * @example
 * // Dark background with white grid (like Footer/Enterprise)
 * <SectionBackground background="dark" showGrid gridSize="sm" gridColor="white">
 *   <Content />
 * </SectionBackground>
 */
export function SectionBackground({
  children,
  className,
  background = "transparent",
  showGrid = false,
  gridSize = "md",
  gridColor = "primary",
  gridOpacity = 0.05,
  padding = "py-20 lg:py-32",
  id,
}: SectionBackgroundProps) {
  const gridSizeValue = gridSizeMap[gridSize]
  const gridColorValue = gridColorMap[gridColor]
  const backgroundClass = backgroundVariantMap[background]

  // Build grid pattern style
  const gridBackgroundImage = showGrid
    ? `linear-gradient(to right, ${gridColorValue} 1px, transparent 1px), linear-gradient(to bottom, ${gridColorValue} 1px, transparent 1px)`
    : undefined

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        padding,
        className
      )}
    >
      {/* Background Layer */}
      {background !== "transparent" && (
        <div className={cn("absolute inset-0", backgroundClass)} />
      )}

      {/* Grid Pattern Layer */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ 
            backgroundImage: gridBackgroundImage,
            backgroundSize: gridSizeValue.replace("_", " "),
            opacity: gridOpacity 
          }}
        />
      )}

      {/* Content */}
      <div className="relative">{children}</div>
    </section>
  )
}
