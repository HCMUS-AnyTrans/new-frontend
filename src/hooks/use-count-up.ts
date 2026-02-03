"use client"

import { useEffect, useState } from "react"

interface UseCountUpOptions {
  start?: number
  end: number
  duration?: number
  delay?: number
  enabled?: boolean
  decimals?: number
}

/**
 * Hook for animated number counting
 * Smoothly animates from start to end value
 */
export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  enabled = true,
  decimals = 0,
}: UseCountUpOptions): number {
  // Initialize with start value, or end value if not enabled
  const initialValue = enabled ? start : end
  const [count, setCount] = useState(initialValue)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function: easeOutExpo
      const easedProgress =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      const currentValue = start + (end - start) * easedProgress
      setCount(Number(currentValue.toFixed(decimals)))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [start, end, duration, delay, enabled, decimals])

  return count
}
