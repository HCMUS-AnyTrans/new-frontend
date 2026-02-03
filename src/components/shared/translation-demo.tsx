"use client"

import { motion } from "framer-motion"
import { Languages, CheckCircle2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingDocument {
  label: string
  color: string
  delay: number
}

interface TranslationDemoProps {
  sourceLanguage?: string
  sourceFlag?: string
  targetLanguage?: string
  targetFlag?: string
  sourceText?: string
  targetText?: string
  className?: string
}

const floatingDocuments: FloatingDocument[] = [
  { label: "PDF", color: "bg-destructive", delay: 0 },
  { label: "Word", color: "bg-accent", delay: 0.2 },
  { label: "SRT", color: "bg-success", delay: 0.4 },
]

export function TranslationDemo({
  sourceLanguage = "English",
  sourceFlag = "EN",
  targetLanguage = "Tiếng Việt",
  targetFlag = "VI",
  sourceText = "The quick brown fox jumps over the lazy dog. This document contains confidential information.",
  targetText = "Con cáo nâu nhanh nhẹn nhảy qua con chó lười. Tài liệu này chứa thông tin bảo mật.",
  className,
}: TranslationDemoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className={cn("relative", className)}
    >
      {/* Main Document Card */}
      <div className="relative bg-card rounded-2xl shadow-2xl shadow-primary/10 border border-border p-6 overflow-hidden">
        {/* Header - Window Controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <div className="w-3 h-3 rounded-full bg-success" />
          </div>
          <div className="flex-1 h-6 bg-muted rounded-lg" />
        </div>

        {/* Translation Preview */}
        <div className="space-y-4">
          {/* Source */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="p-4 bg-muted rounded-xl border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {sourceLanguage}
              </span>
              <span className="text-lg">{sourceFlag}</span>
            </div>
            <p className="text-foreground text-sm leading-relaxed">
              {sourceText}
            </p>
          </motion.div>

          {/* Translation Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Languages className="w-5 h-5 text-primary-foreground" />
            </div>
          </motion.div>

          {/* Target */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="p-4 bg-primary-50 dark:bg-primary-900 rounded-xl border border-primary-200 dark:border-primary-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                {targetLanguage}
              </span>
              <span className="text-lg">{targetFlag}</span>
            </div>
            <p className="text-foreground text-sm leading-relaxed">
              {targetText}
            </p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 flex items-center gap-3"
        >
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.3, duration: 1.5 }}
              className="h-full bg-success rounded-full"
            />
          </div>
          <span className="text-sm font-semibold text-success flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Hoàn tất!
          </span>
        </motion.div>
      </div>

      {/* Floating Document Cards */}
      {floatingDocuments.map((doc, index) => (
        <motion.div
          key={doc.label}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 + doc.delay }}
          className={cn(
            "absolute",
            index === 0 && "-top-6 -left-6",
            index === 1 && "-bottom-4 -left-10",
            index === 2 && "-right-6 top-1/4"
          )}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg",
              doc.color,
              "text-white"
            )}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-semibold">{doc.label}</span>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}
