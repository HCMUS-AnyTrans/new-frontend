"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroBackground } from "@/components/shared"
import {
  PricingGrid,
  UsageExamples,
  EnterpriseBlock,
  PricingFAQ,
  PricingCTA,
} from "@/components/pricing"
import { usageExamples } from "@/data/pricing"

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroBackground>
        <div className="relative max-w-4xl mx-auto text-center">
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
      </HeroBackground>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <PricingGrid />
        </div>
      </section>

      {/* Usage Examples */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Credits trong thực tế
          </h2>
          <UsageExamples examples={usageExamples} />
        </div>
      </section>

      {/* Enterprise Section */}
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

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Câu hỏi thường gặp
          </h2>
          <PricingFAQ />
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <PricingCTA />
        </div>
      </section>
    </>
  )
}
