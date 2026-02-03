"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Upload, Settings, Download, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionBadge } from "@/components/shared"
import { cn } from "@/lib/utils"

interface Step {
  number: string
  icon: React.ElementType
  title: string
  description: string
  iconBg: string
  titleColor: string
  titleBg: string
}

const steps: Step[] = [
  {
    number: "01",
    icon: Upload,
    title: "Tải lên tài liệu",
    description:
      "Kéo thả hoặc chọn file PDF, Word, hoặc Subtitle. Hỗ trợ file lên đến 100MB.",
    iconBg: "bg-primary",
    titleColor: "text-primary",
    titleBg: "bg-primary/10",
  },
  {
    number: "02",
    icon: Settings,
    title: "Cấu hình dịch",
    description:
      "Chọn ngôn ngữ đích, glossary chuyên ngành và các tùy chọn format.",
    iconBg: "bg-secondary-600",
    titleColor: "text-secondary-600",
    titleBg: "bg-secondary/20",
  },
  {
    number: "03",
    icon: Download,
    title: "Tải về kết quả",
    description:
      "Nhận file đã dịch với format giữ nguyên. Review và chỉnh sửa nếu cần.",
    iconBg: "bg-success",
    titleColor: "text-success",
    titleBg: "bg-success/10",
  },
]

interface StepCardProps {
  step: Step
  index: number
}

function StepCard({ step, index }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative group"
    >
      <div className="relative bg-card rounded-2xl border border-border shadow-lg p-8 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        {/* Number Badge */}
        <div
          className={cn(
            "absolute -top-5 left-8 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
            step.iconBg
          )}
        >
          <span className="text-white font-bold text-sm">
            {step.number}
          </span>
        </div>

        {/* Icon */}
        <div className="mt-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
            <step.icon className={cn("w-7 h-7", step.titleColor)} />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3">
          <span className={cn("px-2 py-1 rounded-md", step.titleBg)}>
            <span className={step.titleColor}>{step.title}</span>
          </span>
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {step.description}
        </p>

        {/* Hover Arrow */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowRight className={cn("w-5 h-5", step.titleColor)} />
        </div>
      </div>
    </motion.div>
  )
}

export interface HowItWorksProps {
  className?: string
}

export function HowItWorks({ className }: HowItWorksProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="how-it-works"
      ref={ref}
      className={cn(
        "relative py-20 lg:py-32 overflow-hidden",
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-success-50/50 via-background to-primary-50/30 dark:from-success-900/10 dark:via-background dark:to-primary-900/10" />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-success-200/40 rounded-full blur-3xl dark:bg-success-800/20" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl dark:bg-primary-800/15" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary-200/20 rounded-full blur-3xl -translate-x-1/2 dark:bg-secondary-800/10" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--primary-500)_1px,transparent_0)] bg-[size:40px_40px] opacity-[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 lg:mb-20"
        >
          <SectionBadge
            text="Đơn giản và nhanh chóng"
            icon={Sparkles}
            variant="primary"
            className="mb-4"
          />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
            Chỉ 3 bước để có
            <br />
            <span className="text-primary">bản dịch hoàn hảo</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Dashed Connecting Line */}
          <div className="hidden lg:block absolute top-[60px] left-[20%] right-[20%]">
            <div className="border-t-2 border-dashed border-muted-foreground/30" />
          </div>

          {/* Step Cards */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Button
            size="lg"
            className="shadow-lg shadow-primary/20 text-base px-10 h-14 group"
            asChild
          >
            <Link href="/register" className="flex items-center gap-2">
              Thử ngay miễn phí
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Không cần thẻ tín dụng • Bắt đầu trong 30 giây
          </p>
        </motion.div>
      </div>
    </section>
  )
}
