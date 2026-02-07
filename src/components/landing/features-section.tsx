"use client"

import { useRef } from "react"
import { useTranslations } from "next-intl"
import { motion, useInView } from "framer-motion"
import { Check, ArrowRight, Zap } from "lucide-react"
import { SectionBackground } from "@/components/shared"
import { cn } from "@/lib/utils"
import { features, type Feature } from "@/data/features"

// Static mockup components - no loop animations for fast loading
function FormatMockup() {
  const t = useTranslations("marketing.features.mockup")
  return (
    <div className="relative w-full h-full min-h-48 bg-primary-50 dark:bg-primary-950/30 rounded-xl overflow-hidden p-4">
      <div className="flex gap-3 h-full">
        {/* Before */}
        <div className="flex-1 bg-card rounded-lg shadow-sm border border-border p-3 relative">
          <div className="text-[10px] font-semibold text-muted-foreground mb-2">{t("before")}</div>
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
          <div className="text-[10px] font-semibold text-primary mb-2">{t("after")}</div>
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
    { en: "Artificial Intelligence", vi: "Trí tuệ nhân tạo" },
  ]
  
  return (
    <div className="relative w-full h-full min-h-48 bg-secondary-100 dark:bg-secondary-900/20 rounded-xl overflow-hidden p-4">
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
  const t = useTranslations("marketing.features.mockup")
  return (
    <div className="relative w-full h-full min-h-48 bg-destructive/10 dark:bg-destructive/5 rounded-xl overflow-hidden p-4 flex flex-col justify-center">
      <div className="text-center mb-4">
        <div className="text-4xl font-extrabold text-destructive">10x</div>
        <div className="text-sm text-muted-foreground mt-1">{t("faster")}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="text-[10px] text-muted-foreground mb-1">{t("manual")}</div>
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
    <div className="relative w-full h-full min-h-48 bg-info/10 dark:bg-info/5 rounded-xl overflow-hidden p-4">
      <div className="flex gap-3 h-full items-stretch">
        {/* Original Document */}
        <div className="flex-1 bg-card rounded-lg shadow-sm border border-border overflow-hidden flex flex-col">
          {/* Word-like toolbar */}
          <div className="bg-muted/50 border-b border-border px-2 py-1 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive/60" />
            <div className="w-2 h-2 rounded-full bg-secondary/60" />
            <div className="w-2 h-2 rounded-full bg-success/60" />
            <span className="text-[8px] text-muted-foreground ml-2 truncate">original.docx</span>
          </div>
          {/* Document content */}
          <div className="flex-1 p-3 space-y-2">
            <div className="text-[10px] font-semibold text-foreground">Annual Report 2024</div>
            <div className="space-y-1.5">
              <div className="h-1.5 bg-muted rounded w-full" />
              <div className="h-1.5 bg-muted rounded w-11/12" />
              <div className="h-1.5 bg-muted rounded w-4/5" />
            </div>
            <div className="pt-2 space-y-1.5">
              <div className="h-1.5 bg-muted rounded w-full" />
              <div className="h-1.5 bg-muted rounded w-3/4" />
            </div>
          </div>
          <div className="bg-muted/30 border-t border-border px-2 py-1">
            <span className="text-[8px] text-muted-foreground">EN • 12 pages</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <ArrowRight className="w-4 h-4 text-info" />
        </div>

        {/* Translated Document */}
        <div className="flex-1 bg-card rounded-lg shadow-sm border border-info/30 overflow-hidden flex flex-col">
          {/* Word-like toolbar */}
          <div className="bg-info/10 border-b border-info/20 px-2 py-1 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive/60" />
            <div className="w-2 h-2 rounded-full bg-secondary/60" />
            <div className="w-2 h-2 rounded-full bg-success/60" />
            <span className="text-[8px] text-info ml-2 truncate">translated.docx</span>
          </div>
          {/* Document content */}
          <div className="flex-1 p-3 space-y-2">
            <div className="text-[10px] font-semibold text-info">Báo cáo thường niên 2024</div>
            <div className="space-y-1.5">
              <div className="h-1.5 bg-info/20 rounded w-full" />
              <div className="h-1.5 bg-info/20 rounded w-11/12" />
              <div className="h-1.5 bg-info/20 rounded w-4/5" />
            </div>
            <div className="pt-2 space-y-1.5">
              <div className="h-1.5 bg-info/20 rounded w-full" />
              <div className="h-1.5 bg-info/20 rounded w-3/4" />
            </div>
          </div>
          <div className="bg-info/10 border-t border-info/20 px-2 py-1 flex items-center justify-between">
            <span className="text-[8px] text-info">VI • 12 pages</span>
            <Check className="w-3 h-3 text-success" />
          </div>
        </div>
      </div>
    </div>
  )
}

function OcrMockup() {
  return (
    <div className="relative w-full h-full min-h-48 bg-primary-50 dark:bg-primary-950/30 rounded-xl overflow-hidden p-4">
      <div className="flex gap-3 h-full items-stretch">
        {/* Scanned Image */}
        <div className="flex-1 bg-card rounded-lg shadow-sm border border-border overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-muted/50 border-b border-border px-2 py-1 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive/60" />
            <div className="w-2 h-2 rounded-full bg-secondary/60" />
            <div className="w-2 h-2 rounded-full bg-success/60" />
            <span className="text-[8px] text-muted-foreground ml-2">scan.pdf</span>
          </div>
          {/* Scanned content with scan line effect */}
          <div className="flex-1 p-3 relative bg-muted/20">
            {/* Scan line animation placeholder */}
            <div className="absolute left-0 right-0 top-1/3 h-0.5 bg-primary/60" />
            {/* Simulated scanned text blocks */}
            <div className="space-y-2 opacity-60">
              <div className="h-2 bg-foreground/20 rounded w-4/5" />
              <div className="h-2 bg-foreground/20 rounded w-full" />
              <div className="h-2 bg-foreground/20 rounded w-3/4" />
              <div className="h-2 bg-foreground/20 rounded w-5/6" />
            </div>
          </div>
          <div className="bg-muted/30 border-t border-border px-2 py-1">
            <span className="text-[8px] text-muted-foreground">Image • PDF</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>

        {/* Extracted Text */}
        <div className="flex-1 bg-card rounded-lg shadow-sm border border-primary/30 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-primary/10 border-b border-primary/20 px-2 py-1 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive/60" />
            <div className="w-2 h-2 rounded-full bg-secondary/60" />
            <div className="w-2 h-2 rounded-full bg-success/60" />
            <span className="text-[8px] text-primary ml-2">extracted.docx</span>
          </div>
          {/* Extracted content */}
          <div className="flex-1 p-3 space-y-2">
            <div className="text-[10px] font-semibold text-primary">Hợp đồng kinh tế</div>
            <div className="space-y-1.5">
              <div className="h-1.5 bg-primary/20 rounded w-full" />
              <div className="h-1.5 bg-primary/20 rounded w-11/12" />
              <div className="h-1.5 bg-primary/20 rounded w-4/5" />
            </div>
            <div className="pt-1 space-y-1.5">
              <div className="h-1.5 bg-primary/20 rounded w-full" />
              <div className="h-1.5 bg-primary/20 rounded w-3/4" />
            </div>
          </div>
          <div className="bg-primary/10 border-t border-primary/20 px-2 py-1 flex items-center justify-between">
            <span className="text-[8px] text-primary">99.2% accuracy</span>
            <Check className="w-3 h-3 text-success" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SavingsMockup() {
  return (
    <div className="relative w-full h-full min-h-48 bg-success/10 dark:bg-success/5 rounded-xl overflow-hidden p-4 flex flex-col justify-center items-center">
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
  const t = useTranslations("marketing.features")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <SectionBackground
      id="features"
      background="gradient"
      showGrid
      gridSize="sm"
      className={className}
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl dark:bg-primary-800/20" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl dark:bg-secondary-800/10" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl dark:bg-accent-800/10" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 lg:mb-24"
        >

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
            {t("sectionTitle")}
            <br />
            <span className="text-primary">{t("sectionSubtitle")}</span>
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
                "flex flex-col gap-8 lg:gap-16 items-stretch",
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              {/* Visual */}
              <div className="w-full lg:w-2/5 flex">
                <div className="relative bg-card rounded-2xl border border-border shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer w-full flex">
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
    </SectionBackground>
  )
}
