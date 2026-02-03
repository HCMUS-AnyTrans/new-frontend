"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  FileCheck,
  BookOpen,
  Zap,
  Eye,
  ScanLine,
  PiggyBank,
  Check,
  ArrowRight,
  LucideIcon,
} from "lucide-react"
import { SectionBadge } from "@/components/shared"
import { cn } from "@/lib/utils"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  highlights: string[]
  iconBg: string
  titleColor: string
  titleBg: string
  visual: string
}

const features: Feature[] = [
  {
    icon: FileCheck,
    title: "Giữ nguyên format gốc",
    description:
      "Bảng biểu, hình ảnh, header/footer được bảo toàn hoàn hảo. Xuất file đúng định dạng ban đầu.",
    highlights: ["Giữ nguyên bảng biểu", "Bảo toàn hình ảnh", "Định dạng PDF/Word"],
    iconBg: "bg-primary",
    titleColor: "text-primary",
    titleBg: "bg-primary/10",
    visual: "format",
  },
  {
    icon: BookOpen,
    title: "Glossary thông minh",
    description:
      "Tạo và quản lý bộ từ điển chuyên ngành. Đảm bảo thuật ngữ nhất quán trong toàn bộ tài liệu.",
    highlights: ["Từ điển chuyên ngành", "Thuật ngữ nhất quán", "Tự động áp dụng"],
    iconBg: "bg-secondary-600",
    titleColor: "text-secondary-600",
    titleBg: "bg-secondary/20",
    visual: "glossary",
  },
  {
    icon: Zap,
    title: "Nhanh gấp 10 lần",
    description:
      "Xử lý tài liệu 50 trang chỉ trong vài phút. Tiết kiệm hàng giờ làm việc mỗi ngày.",
    highlights: ["50 trang/2 phút", "Xử lý batch", "Real-time progress"],
    iconBg: "bg-destructive",
    titleColor: "text-destructive",
    titleBg: "bg-destructive/10",
    visual: "speed",
  },
  {
    icon: Eye,
    title: "Review song ngữ",
    description:
      "Giao diện 2 cột cho phép so sánh bản gốc và bản dịch. Chỉnh sửa trực tiếp dễ dàng.",
    highlights: ["So sánh song ngữ", "Edit inline", "Track changes"],
    iconBg: "bg-info",
    titleColor: "text-info",
    titleBg: "bg-info/10",
    visual: "review",
  },
  {
    icon: ScanLine,
    title: "OCR hình ảnh",
    description:
      "Nhận diện và dịch văn bản trong hình ảnh. Hỗ trợ scan tài liệu chất lượng cao.",
    highlights: ["Nhận diện chữ in", "Scan tài liệu", "Độ chính xác 99%"],
    iconBg: "bg-primary",
    titleColor: "text-primary",
    titleBg: "bg-primary/10",
    visual: "ocr",
  },
  {
    icon: PiggyBank,
    title: "Tiết kiệm 80% chi phí",
    description:
      "Chi phí chỉ bằng 1/5 so với thuê dịch giả. ROI rõ ràng ngay từ tháng đầu tiên.",
    highlights: ["Giá từ 0.001$/từ", "Không phí ẩn", "Hoàn tiền 30 ngày"],
    iconBg: "bg-success",
    titleColor: "text-success",
    titleBg: "bg-success/10",
    visual: "savings",
  },
]

// Static mockup components - no loop animations for fast loading
function FormatMockup() {
  return (
    <div className="relative w-full h-48 bg-primary-50 dark:bg-primary-950/30 rounded-xl overflow-hidden p-4">
      <div className="flex gap-3 h-full">
        {/* Before */}
        <div className="flex-1 bg-card rounded-lg shadow-sm border border-border p-3 relative">
          <div className="text-[10px] font-semibold text-muted-foreground mb-2">BEFORE</div>
          <div className="space-y-1.5">
            <div className="h-2 bg-muted rounded w-full" />
            <div className="h-2 bg-muted rounded w-3/4" />
            <div className="grid grid-cols-3 gap-1 my-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-destructive/10 rounded" />
              ))}
            </div>
            <div className="h-2 bg-muted rounded w-5/6" />
          </div>
          <div className="absolute top-2 right-2 w-5 h-5 rounded bg-destructive/10 flex items-center justify-center">
            <span className="text-destructive text-[8px] font-bold">EN</span>
          </div>
        </div>
        
        {/* Arrow */}
        <div className="flex items-center">
          <ArrowRight className="w-5 h-5 text-primary" />
        </div>
        
        {/* After */}
        <div className="flex-1 bg-card rounded-lg shadow-sm border border-primary/20 p-3 relative">
          <div className="text-[10px] font-semibold text-primary mb-2">AFTER</div>
          <div className="space-y-1.5">
            <div className="h-2 bg-primary/10 rounded w-full" />
            <div className="h-2 bg-primary/10 rounded w-3/4" />
            <div className="grid grid-cols-3 gap-1 my-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-success/10 rounded" />
              ))}
            </div>
            <div className="h-2 bg-primary/10 rounded w-5/6" />
          </div>
          <div className="absolute top-2 right-2 w-5 h-5 rounded bg-success/10 flex items-center justify-center">
            <span className="text-success text-[8px] font-bold">VI</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function GlossaryMockup() {
  const terms = [
    { en: "Machine Learning", vi: "Học máy" },
    { en: "Neural Network", vi: "Mạng nơ-ron" },
    { en: "Deep Learning", vi: "Học sâu" },
  ]
  
  return (
    <div className="relative w-full h-48 bg-secondary-100 dark:bg-secondary-900/20 rounded-xl overflow-hidden p-4">
      <div className="space-y-2">
        {terms.map((term) => (
          <div
            key={term.en}
            className="flex items-center gap-2 bg-card rounded-lg p-3 shadow-sm border border-secondary-300/30"
          >
            <div className="w-30 text-xs font-medium text-muted-foreground truncate">
              {term.en}
            </div>
            <ArrowRight className="w-4 h-4 text-secondary-600 shrink-0" />
            <div className="flex-1 text-xs font-semibold text-secondary-600 truncate">
              {term.vi}
            </div>
            <Check className="w-4 h-4 text-secondary-600" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SpeedMockup() {
  return (
    <div className="relative w-full h-48 bg-destructive/10 dark:bg-destructive/5 rounded-xl overflow-hidden p-4 flex flex-col justify-center">
      <div className="text-center mb-4">
        <div className="text-4xl font-extrabold text-destructive">10x</div>
        <div className="text-sm text-muted-foreground mt-1">Nhanh hơn</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="text-[10px] text-muted-foreground mb-1">Thủ công</div>
          <div className="h-3 bg-muted rounded-full w-full" />
        </div>
        <div className="text-xs text-muted-foreground">vs</div>
        <div className="flex-1">
          <div className="text-[10px] text-destructive mb-1">AnyTrans</div>
          <div className="h-3 bg-destructive rounded-full w-full" />
        </div>
      </div>
    </div>
  )
}

function ReviewMockup() {
  return (
    <div className="relative w-full h-48 bg-info/10 dark:bg-info/5 rounded-xl overflow-hidden">
      <div className="flex h-full">
        <div className="flex-1 border-r border-info/20 p-3">
          <div className="text-[10px] font-semibold text-muted-foreground mb-2 flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-muted" />
            Original
          </div>
          <div className="space-y-1.5 text-[10px] text-muted-foreground">
            <p>The quick brown fox...</p>
            <p>jumps over the lazy dog.</p>
          </div>
        </div>
        <div className="flex-1 p-3 bg-info/5">
          <div className="text-[10px] font-semibold text-info mb-2 flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-info/30" />
            Translated
          </div>
          <div className="space-y-1.5 text-[10px] text-info/80">
            <p>Con cáo nâu nhanh nhẹn...</p>
            <p className="bg-info/10 rounded px-1">nhảy qua con chó lười.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function OcrMockup() {
  return (
    <div className="relative w-full h-48 bg-accent/10 dark:bg-accent/5 rounded-xl overflow-hidden p-4">
      <div className="relative h-full bg-card rounded-lg border border-accent/20 overflow-hidden">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-accent/50" />
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-muted rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-2 bg-accent/20 rounded w-3/4" />
              <div className="h-2 bg-accent/20 rounded w-1/2" />
            </div>
          </div>
          <div className="text-[10px] text-accent font-medium">
            Scanning... 99% accuracy
          </div>
        </div>
      </div>
    </div>
  )
}

function SavingsMockup() {
  return (
    <div className="relative w-full h-48 bg-success/10 dark:bg-success/5 rounded-xl overflow-hidden p-4 flex flex-col justify-center items-center">
      <div className="relative">
        <div className="text-5xl font-bold text-success">$</div>
        <div className="absolute -top-2 -right-4 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold">
          -80%
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-sm text-muted-foreground line-through">$0.10/word (Translator)</div>
        <div className="text-lg font-bold text-success">$0.001/word (AnyTrans)</div>
      </div>
    </div>
  )
}

function FeatureVisual({ type }: { type: string }) {
  switch (type) {
    case "format":
      return <FormatMockup />
    case "glossary":
      return <GlossaryMockup />
    case "speed":
      return <SpeedMockup />
    case "review":
      return <ReviewMockup />
    case "ocr":
      return <OcrMockup />
    case "savings":
      return <SavingsMockup />
    default:
      return null
  }
}

interface FeatureContentProps {
  feature: Feature
}

function FeatureContent({ feature }: FeatureContentProps) {
  return (
    <div className="space-y-6">
      {/* Title with background highlight */}
      <h3 className="text-2xl lg:text-3xl font-bold">
        <span className={cn("px-2 py-1 rounded-md", feature.titleBg)}>
          <span className={feature.titleColor}>{feature.title}</span>
        </span>
      </h3>

      {/* Description */}
      <p className="text-lg text-muted-foreground leading-relaxed">
        {feature.description}
      </p>

      {/* Highlights */}
      <ul className="space-y-3">
        {feature.highlights.map((highlight) => (
          <li key={highlight} className="flex items-center gap-3">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                feature.iconBg
              )}
            >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
            <span className="text-foreground font-medium">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export interface FeaturesSectionProps {
  className?: string
}

export function FeaturesSection({ className }: FeaturesSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="features"
      ref={ref}
      className={cn(
        "relative py-20 lg:py-32 overflow-hidden",
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background dark:from-primary-900/10 dark:via-background" />
      
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl dark:bg-primary-800/20" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl dark:bg-secondary-800/10" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl dark:bg-accent-800/10" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary-500)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-500)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 lg:mb-24"
        >
          <SectionBadge
            text="Tính năng vượt trội"
            icon={Zap}
            variant="primary"
            className="mb-4"
          />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
            Mọi thứ bạn cần để dịch
            <br />
            <span className="text-primary">tài liệu chuyên nghiệp</span>
          </h2>
        </motion.div>

        {/* Features List */}
        <div className="space-y-16 lg:space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "flex flex-col gap-8 lg:gap-16 items-center",
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              {/* Visual */}
              <div className="w-full lg:w-2/5">
                <div className="relative bg-card rounded-2xl border border-border shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <FeatureVisual type={feature.visual} />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-3/5">
                <FeatureContent feature={feature} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
