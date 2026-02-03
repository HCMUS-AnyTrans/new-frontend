import { SectionBackground } from "@/components/shared"
import { History } from "lucide-react"
import { cn } from "@/lib/utils"
import { milestones, type Milestone } from "@/data/about"

interface TimelineItemProps {
  milestone: Milestone
  index: number
}

function TimelineItem({ milestone, index }: TimelineItemProps) {
  const isLeft = index % 2 === 0

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 lg:gap-8",
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      {/* Content Card */}
      <div
        className={cn(
          "flex-1 p-6 rounded-2xl border transition-colors duration-300",
          milestone.highlight
            ? "bg-primary/5 border-primary/30 hover:border-primary/50"
            : "bg-card border-border hover:border-primary/20 hover:shadow-md"
        )}
      >
        <div
          className={cn(
            "inline-block px-3 py-1 rounded-full text-sm font-bold mb-3",
            milestone.highlight
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {milestone.year}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {milestone.title}
        </h3>
        <p className="text-muted-foreground">{milestone.description}</p>
      </div>

      {/* Timeline dot - visible on desktop */}
      <div className="hidden lg:block flex-shrink-0">
        <div
          className={cn(
            "w-4 h-4 rounded-full border-4",
            milestone.highlight
              ? "bg-primary border-primary/30"
              : "bg-card border-border"
          )}
        />
      </div>

      {/* Empty space for alternating layout */}
      <div className="hidden lg:block flex-1" />
    </div>
  )
}

export interface TimelineSectionProps {
  className?: string
}

export function TimelineSection({ className }: TimelineSectionProps) {
  return (
    <SectionBackground
      background="transparent"
      showGrid
      gridSize="sm"
      gridOpacity={0.03}
      className={className}
      padding="py-20 lg:py-28"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Hành trình phát triển
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những cột mốc quan trọng trên con đường xây dựng AnyTrans
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - desktop only */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-6 lg:space-y-8">
            {milestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.year}
                milestone={milestone}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionBackground>
  )
}
