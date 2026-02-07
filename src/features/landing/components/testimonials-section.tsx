"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  Clock,
} from "lucide-react"
import { SectionBackground } from "@/components/shared"
import { cn } from "@/lib/utils"
import { avatarColors } from "../data"
import type { LucideIcon } from "lucide-react"

// Types for translated testimonials
interface TranslatedTestimonial {
  name: string
  role: string
  company: string
  industry: string
  content: string
}

// Stats configuration (icons only - labels come from translations)
const statsConfig: { id: string; icon: LucideIcon; value: string }[] = [
  { id: "rating", icon: Star, value: "4.9/5" },
  { id: "users", icon: Users, value: "10K+" },
  { id: "documents", icon: FileText, value: "5M+" },
  { id: "uptime", icon: Clock, value: "99.9%" },
]

// Avatar initials mapping
const avatarInitials = ["NM", "TH", "LH", "PM", "DT", "VA"]

// --- Sub-components ---

interface TestimonialCardProps {
  testimonial: TranslatedTestimonial
  avatar: string
  colorIndex: number
}

function TestimonialCard({ testimonial, avatar, colorIndex }: TestimonialCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="relative group h-full">
      <div className="relative bg-card rounded-2xl border border-border p-6 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
        {/* Quote Icon */}
        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center border border-primary/20">
          <Quote className="w-4 h-4 text-primary" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-secondary text-secondary"
            />
          ))}
        </div>

        {/* Content */}
        <p className="text-muted-foreground leading-relaxed flex-1 text-pretty">
          {`"${testimonial.content}"`}
        </p>

        {/* Author */}
        <div className="mt-6 pt-4 border-t border-border flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0",
              avatarColors[colorIndex % avatarColors.length]
            )}
          >
            {avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {testimonial.name}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {testimonial.role}, {testimonial.company}
            </p>
          </div>
          <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground shrink-0">
            {testimonial.industry}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

interface StatItemProps {
  stat: { id: string; icon: LucideIcon; value: string }
  label: string
  index: number
  isInView: boolean
}

function StatItem({ stat, label, index, isInView }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
      className="text-center"
    >
      <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mx-auto mb-3 border border-primary/20">
        <stat.icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-2xl lg:text-3xl font-extrabold text-foreground">
        {stat.value}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  )
}

// --- Main Section ---

export interface TestimonialsSectionProps {
  className?: string
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const t = useTranslations("marketing.testimonialsSection")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(3)

  // Get testimonials from translations
  const testimonials = t.raw("items") as TranslatedTestimonial[]

  useEffect(() => {
    const checkMobile = () => setItemsPerPage(window.innerWidth < 768 ? 1 : 3)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages)
    }, 5000)
    return () => clearInterval(interval)
  }, [isHovered, totalPages])

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalPages)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  )

  return (
    <SectionBackground
      id="testimonials"
      background="gradient"
      showGrid
      gridSize="sm"
      className={className}
    >
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground text-balance">
            {t("title")}
            <br />
            <span className="text-primary">{t("subtitle")}</span>
          </h2>
        </motion.div>

        {/* Testimonials Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            aria-label="Previous testimonials"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-card shadow-lg border border-border hidden md:flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next testimonials"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-card shadow-lg border border-border hidden md:flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="overflow-hidden -mx-4 px-4 -my-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {currentTestimonials.map((testimonial, idx) => {
                  const globalIdx = currentIndex * itemsPerPage + idx
                  return (
                    <TestimonialCard
                      key={testimonial.name}
                      testimonial={testimonial}
                      avatar={avatarInitials[globalIdx % avatarInitials.length]}
                      colorIndex={globalIdx}
                    />
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to page ${i + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-muted hover:bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {statsConfig.map((stat, index) => (
            <StatItem
              key={stat.id}
              stat={stat}
              label={t(`stats.${stat.id}`)}
              index={index}
              isInView={isInView}
            />
          ))}
        </motion.div>
      </div>
    </SectionBackground>
  )
}
