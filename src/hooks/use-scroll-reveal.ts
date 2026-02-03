"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

interface UseScrollRevealReturn<T extends HTMLElement> {
  ref: RefObject<T | null>
  isVisible: boolean
}

/**
 * Hook to detect when an element enters the viewport
 * Uses IntersectionObserver for performance
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
): UseScrollRevealReturn<T> {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options

  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}
