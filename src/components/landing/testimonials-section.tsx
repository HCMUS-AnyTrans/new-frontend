"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Star,
  Quote,
  ArrowRight,
  Users,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionBadge } from "@/components/shared"
import { cn } from "@/lib/utils"

// --- Data ---

interface Testimonial {
  name: string
  role: string
  company: string
  industry: string
  avatar: string
  content: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: "Nguyễn Văn Minh",
    role: "CEO",
    company: "TechViet Solutions",
    industry: "Công nghệ",
    avatar: "NM",
    content:
      "AnyTrans đã giúp team chúng tôi tiết kiệm hàng chục giờ mỗi tuần. Chất lượng dịch thuật vượt xa mong đợi, đặc biệt với tài liệu kỹ thuật.",
    rating: 5,
  },
  {
    name: "Trần Thị Hương",
    role: "Giám đốc dịch vụ",
    company: "Legal Partners",
    industry: "Pháp lý",
    avatar: "TH",
    content:
      "Tính năng glossary chuyên ngành là game-changer. Các thuật ngữ pháp lý được dịch chính xác và nhất quán trong toàn bộ hợp đồng 200 trang.",
    rating: 5,
  },
  {
    name: "Lê Quang Huy",
    role: "Founder",
    company: "SubViet Studio",
    industry: "Truyền thông",
    avatar: "LH",
    content:
      "Dịch subtitle nhanh không tưởng! Trước đây mất cả ngày, giờ chỉ cần 10 phút. ROI rõ ràng ngay từ tháng đầu tiên.",
    rating: 5,
  },
  {
    name: "Phạm Thị Mai",
    role: "Content Manager",
    company: "EduGlobal",
    industry: "Giáo dục",
    avatar: "PM",
    content:
      "Dịch tài liệu học thuật cần độ chính xác cao. AnyTrans không chỉ nhanh mà còn giữ nguyên các công thức và biểu đồ phức tạp.",
    rating: 5,
  },
  {
    name: "Đặng Minh Tuấn",
    role: "Product Owner",
    company: "FinTech Corp",
    industry: "Tài chính",
    avatar: "DT",
    content:
      "API integration mượt mà, documentation rõ ràng. Đã tích hợp vào hệ thống nội bộ trong vòng 2 ngày. Highly recommended!",
    rating: 5,
  },
  {
    name: "Vũ Hoàng Anh",
    role: "Operations Director",
    company: "Manufacturing Plus",
    industry: "Sản xuất",
    avatar: "VA",
    content:
      "Dịch technical manual 500 trang chỉ trong 30 phút với format hoàn hảo. Đội ngũ hỗ trợ cực kỳ chuyên nghiệp.",
    rating: 5,
  },
]

interface Stat {
  icon: LucideIcon
  label: string
  value: string
}

const stats: Stat[] = [
  { icon: Star, label: "Đánh giá trung bình", value: "4.9/5" },
  { icon: Users, label: "Người dùng hài lòng", value: "10K+" },
  { icon: FileText, label: "Tài liệu đã dịch", value: "5M+" },
  { icon: Clock, label: "Uptime", value: "99.9%" },
]

// Avatar background colors, cycling through
const avatarColors = [
  "bg-primary",
  "bg-secondary-600",
  "bg-success",
  "bg-info",
  "bg-accent",
  "bg-destructive",
]

// --- Sub-components ---

interface TestimonialCardProps {
  testimonial: Testimonial
  colorIndex: number
}

function TestimonialCard({ testimonial, colorIndex }: TestimonialCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="relative group h-full">
      <div className="relative bg-card rounded-2xl border border-border p-6 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
        {/* Quote Icon */}
        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center border border-primary/20">
          <Quote className="w-4 h-4 text-primary" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
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
            {testimonial.avatar}
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
  stat: Stat
  index: number
  isInView: boolean
}

function StatItem({ stat, index, isInView }: StatItemProps) {
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
      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
    </motion.div>
  )
}

// --- Main Section ---

export interface TestimonialsSectionProps {
  className?: string
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(3)

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
    <section
      id="testimonials"
      ref={ref}
      className={cn("relative py-20 lg:py-32 overflow-hidden", className)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-50/30 to-background dark:from-background dark:via-primary-900/10 dark:to-background" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary-500)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-500)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <SectionBadge
            text="Đánh giá từ khách hàng"
            icon={Star}
            variant="primary"
            className="mb-4"
          />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground text-balance">
            Được tin tưởng bởi
            <br />
            <span className="text-primary">hàng ngàn doanh nghiệp</span>
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
                {currentTestimonials.map((testimonial, idx) => (
                  <TestimonialCard
                    key={testimonial.name}
                    testimonial={testimonial}
                    colorIndex={currentIndex * itemsPerPage + idx}
                  />
                ))}
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
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} index={index} isInView={isInView} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="shadow-lg shadow-primary/20 text-base px-10 h-14 group"
              asChild
            >
              <Link href="/register" className="flex items-center gap-2">
                Bắt đầu miễn phí
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
