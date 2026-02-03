"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { missionVision, type MissionVisionItem } from "@/data/about"
import { useScrollReveal } from "@/hooks"

interface MissionVisionCardProps {
  item: MissionVisionItem
  index: number
  isVisible: boolean
}

function MissionVisionCard({ item, index, isVisible }: MissionVisionCardProps) {
  const Icon = item.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={cn(
        "relative p-8 rounded-2xl border transition-all duration-300",
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
      <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
    </motion.div>
  )
}

export interface OurStoryProps {
  className?: string
}

export function OurStory({ className }: OurStoryProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      className={cn("py-20 lg:py-28", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Câu chuyện của chúng tôi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Từ ý tưởng đơn giản đến nền tảng dịch thuật AI hàng đầu
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {missionVision.map((item, index) => (
            <MissionVisionCard
              key={item.id}
              item={item}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
