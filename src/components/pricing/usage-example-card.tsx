"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { UsageExample } from "@/data/pricing"

// ============================================================================
// Counter Hook - Animated number counting
// ============================================================================

function useCountUp(
  end: number,
  duration: number = 1200,
  startOnView: boolean = true
) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(!startOnView)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOnView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasStarted, startOnView])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [hasStarted, end, duration])

  return { count, ref }
}

// ============================================================================
// Usage Example Card Component
// ============================================================================

export interface UsageExampleCardProps {
  example: UsageExample
  className?: string
}

export function UsageExampleCard({
  example,
  className,
}: UsageExampleCardProps) {
  const { count, ref } = useCountUp(example.credits, 1200)
  const Icon = example.icon

  return (
    <div ref={ref} className={className}>
      <Card
        className={cn(
          "bg-card/50 backdrop-blur-sm border-primary/20 text-center p-6",
          "hover:bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
          "transition-colors duration-300"
        )}
      >
        <CardContent className="p-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm mb-2">{example.label}</p>
          <p className="text-4xl font-bold text-foreground">{count}</p>
          <p className="text-muted-foreground text-xs mt-1">credits</p>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// Usage Examples Grid
// ============================================================================

export interface UsageExamplesProps {
  examples: UsageExample[]
  className?: string
}

export function UsageExamples({ examples, className }: UsageExamplesProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-6", className)}>
      {examples.map((example) => (
        <UsageExampleCard key={example.label} example={example} />
      ))}
    </div>
  )
}
