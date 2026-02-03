"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionBadge } from "@/components/shared"
import {
  PricingGrid,
  UsageExamples,
  FeatureComparison,
  EnterpriseBlock,
  PricingFAQ,
  PricingCTA,
} from "@/components/pricing"
import { usageExamples } from "@/data/pricing"

// ============================================================================
// Fade In Animation Wrapper
// ============================================================================

function FadeInSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Main Page
// ============================================================================

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <FadeInSection>
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <SectionBadge
              text="Bảng giá"
              icon={Coins}
              variant="primary"
              className="mb-6"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 text-balance">
              Giá đơn giản,
              <br />
              <span className="text-primary">chỉ trả cho những gì bạn dùng</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              1 Credit = 1 trang dịch. Không subscription. Không giới hạn thời gian.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="shadow-lg shadow-primary/20 px-8 h-14 text-lg group"
                asChild
              >
                <Link href="/register" className="flex items-center gap-2">
                  Bắt đầu miễn phí
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 h-14 text-lg"
                asChild
              >
                <Link href="/demo">Xem demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Pricing Cards */}
      <FadeInSection delay={0.1}>
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <PricingGrid />
          </div>
        </section>
      </FadeInSection>

      {/* Usage Examples */}
      <FadeInSection delay={0.1}>
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Credits trong thực tế
            </h2>
            <UsageExamples examples={usageExamples} />
          </div>
        </section>
      </FadeInSection>

      {/* Feature Comparison Table */}
      <FadeInSection delay={0.1}>
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              So sánh tính năng
            </h2>
            <FeatureComparison />
          </div>
        </section>
      </FadeInSection>

      {/* Enterprise Section */}
      <FadeInSection delay={0.1}>
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Enterprise & Volume Pricing
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Cần hơn 10.000.000 credits? Chúng tôi cung cấp giá tùy chỉnh cho doanh nghiệp.
            </p>
            <EnterpriseBlock variant="light" />
          </div>
        </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FadeInSection delay={0.1}>
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Câu hỏi thường gặp
            </h2>
            <PricingFAQ />
          </div>
        </section>
      </FadeInSection>

      {/* Final CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <PricingCTA />
        </div>
      </section>
    </>
  )
}
