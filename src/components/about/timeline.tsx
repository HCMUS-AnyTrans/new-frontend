"use client"

import { motion } from "framer-motion"
import { SectionBadge } from "@/components/shared"
import { History } from "lucide-react"
import { cn } from "@/lib/utils"
import { milestones, type Milestone } from "@/data/about"
import { useScrollReveal } from "@/hooks"

interface TimelineItemProps {
  milestone: Milestone
  index: number
  isVisible: boolean
}

function TimelineItem({ milestone, index, isVisible }: TimelineItemProps) {
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={cn(
        "relative flex items-center gap-4 lg:gap-8",
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      {/* Content Card */}
      <div
        className={cn(
          "flex-1 p-6 rounded-2xl border transition-all duration-300",
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

      {/* Timeline dot - visible on mobile */}
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
    </motion.div>
  )
}

export interface TimelineSectionProps {
  className?: string
}

export function TimelineSection({ className }: TimelineSectionProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      className={cn("py-20 lg:py-28", className)}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <SectionBadge
            text="Hành trình"
            icon={History}
            variant="info"
            className="mb-4"
          />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Hành trình phát triển
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những cột mốc quan trọng trên con đường xây dựng AnyTrans
          </p>
        </motion.div>

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
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
