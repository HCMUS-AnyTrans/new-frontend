"use client"

import { motion } from "framer-motion"
import { SectionBadge } from "@/components/shared"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { coreValues, type CoreValue } from "@/data/about"
import { useScrollReveal } from "@/hooks"

interface ValueCardProps {
  value: CoreValue
  index: number
  isVisible: boolean
}

function ValueCard({ value, index, isVisible }: ValueCardProps) {
  const Icon = value.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative p-6 lg:p-8 rounded-2xl border border-border bg-card",
        "hover:shadow-lg hover:border-primary/30 transition-all duration-300",
        value.gridClass
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
    </motion.div>
  )
}

export interface CoreValuesProps {
  className?: string
}

export function CoreValues({ className }: CoreValuesProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      className={cn(
        "relative py-20 lg:py-28 overflow-hidden",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30 dark:bg-muted/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <SectionBadge
            text="Giá trị cốt lõi"
            icon={Sparkles}
            variant="secondary"
            className="mb-4"
          />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Những giá trị định hình chúng tôi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mỗi quyết định và hành động của chúng tôi đều được dẫn dắt bởi những
            giá trị này
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {coreValues.map((value, index) => (
            <ValueCard
              key={value.id}
              value={value}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
