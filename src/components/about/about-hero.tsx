"use client"

import { cn } from "@/lib/utils"
import { aboutStats, type AboutStat } from "@/data/about"
import { useScrollReveal, useCountUp } from "@/hooks"

interface StatCardProps {
  stat: AboutStat
  isVisible: boolean
}

function StatCard({ stat, isVisible }: StatCardProps) {
  const count = useCountUp({
    end: stat.value,
    duration: 2000,
    delay: 0,
    enabled: isVisible,
    decimals: stat.value % 1 !== 0 ? 1 : 0,
  })

  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary mb-2">
        {count}
        <span className="text-primary">{stat.suffix}</span>
      </div>
      <div className="text-sm sm:text-base text-muted-foreground font-medium">
        {stat.label}
      </div>
    </div>
  )
}

export interface AboutHeroProps {
  className?: string
}

export function AboutHero({ className }: AboutHeroProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      className={cn(
        "relative py-20 lg:py-32 overflow-hidden",
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background dark:from-primary-950/30 dark:via-background" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl dark:bg-primary-800/20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl dark:bg-secondary-800/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Xoá bỏ rào cản ngôn ngữ
            <br />
            <span className="text-primary">bằng sức mạnh AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AnyTrans là nền tảng dịch thuật AI tiên tiến, giúp bạn dịch tài liệu
            chuyên nghiệp với độ chính xác cao và giữ nguyên định dạng gốc.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {aboutStats.map((stat) => (
            <StatCard
              key={stat.label}
              stat={stat}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
