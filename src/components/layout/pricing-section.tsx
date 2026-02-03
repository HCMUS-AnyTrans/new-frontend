"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Check, Coins, Star, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionBadge } from "@/components/shared"
import { cn } from "@/lib/utils"

interface Plan {
  name: string
  credits: string
  price: string
  unitPrice: string
  savings?: string
  popular: boolean
}

const plans: Plan[] = [
  {
    name: "Starter",
    credits: "100.000",
    price: "99.000",
    unitPrice: "~1đ",
    popular: false,
  },
  {
    name: "Popular",
    credits: "500.000",
    price: "399.000",
    unitPrice: "~0.8đ",
    savings: "Tiết kiệm 20%",
    popular: true,
  },
  {
    name: "Pro",
    credits: "2.000.000",
    price: "999.000",
    unitPrice: "~0.5đ",
    savings: "Tiết kiệm 50%",
    popular: false,
  },
]

// Tính năng chung cho tất cả gói
const features = [
  "Dịch PDF, Word, Subtitle",
  "Giữ nguyên format gốc",
  "Glossary không giới hạn",
  "Review song ngữ",
  "OCR hình ảnh",
  "Credits không hết hạn",
]

interface PricingCardProps {
  plan: Plan
  index: number
}

function PricingCard({ plan, index }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn("relative", plan.popular && "md:-mt-4 md:mb-[-16px]")}
    >
      {/* Card with hover effect - badge inside */}
      <div
        className={cn(
          "relative h-full bg-card rounded-2xl border p-8 transition-all duration-300 cursor-pointer",
          "hover:-translate-y-1 hover:shadow-xl",
          plan.popular
            ? "border-primary shadow-xl shadow-primary/10 pt-12"
            : "border-border shadow-lg"
        )}
      >
        {/* Popular Badge - inside card */}
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              Phổ biến nhất
            </span>
          </div>
        )}

        {/* Plan Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          <p className="text-2xl font-extrabold text-primary mt-2">
            {plan.credits} <span className="text-base font-medium text-muted-foreground">credits</span>
          </p>
        </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-foreground">
                {plan.price}
              </span>
              <span className="text-muted-foreground">đ</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium text-primary">
                {plan.unitPrice}/credit
              </span>
            </div>
            {plan.savings && (
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20">
                {plan.savings}
              </span>
            )}
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            className={cn(
              "w-full h-12 group",
              plan.popular && "shadow-lg shadow-primary/20"
            )}
            variant={plan.popular ? "default" : "outline"}
            asChild
          >
            <Link href="/register" className="flex items-center justify-center gap-2">
              Mua ngay
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
    </motion.div>
  )
}

function EnterpriseBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-16"
    >
      <div className="relative bg-foreground rounded-3xl p-8 md:p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-background">Enterprise</h3>
              <p className="text-muted mt-1">
                Giải pháp tùy chỉnh cho doanh nghiệp lớn với SLA cam kết
              </p>
            </div>
          </div>

          <Button
            size="lg"
            variant="secondary"
            className="bg-background text-foreground hover:bg-muted shadow-xl group"
            asChild
          >
            <Link href="/contact" className="flex items-center gap-2">
              Liên hệ tư vấn
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export interface PricingSectionProps {
  className?: string
}

export function PricingSection({ className }: PricingSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="pricing"
      ref={ref}
      className={cn(
        "relative py-20 lg:py-32 overflow-hidden",
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 via-background to-secondary-50/20 dark:from-primary-900/10 dark:via-background dark:to-secondary-900/5" />

      {/* Decorative blobs */}
      <div className="absolute top-40 left-10 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl dark:bg-primary-800/15" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary-200/30 rounded-full blur-3xl dark:bg-secondary-800/10" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--primary-500)_1px,transparent_0)] bg-[size:48px_48px] opacity-[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <SectionBadge
            text="Mua credits"
            icon={Coins}
            variant="secondary"
            className="mb-4"
          />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
            Giá đơn giản,
            <br />
            <span className="text-primary">trả theo nhu cầu</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Mua credits một lần, sử dụng không giới hạn thời gian. Mua càng nhiều, giá càng rẻ.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* Enterprise Block */}
        <EnterpriseBlock />
      </div>
    </section>
  )
}
