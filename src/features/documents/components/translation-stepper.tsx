"use client"

import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { TranslationStep } from "../types"

interface TranslationStepperProps {
  currentStep: TranslationStep
  className?: string
}

export function TranslationStepper({ currentStep, className }: TranslationStepperProps) {
  const t = useTranslations("documents.wizard.steps")

  const steps: { number: TranslationStep; label: string }[] = [
    { number: 1, label: t("upload") },
    { number: 2, label: t("configure") },
    { number: 3, label: t("review") },
  ]

  return (
    <div className={cn("flex items-center justify-center py-4 sm:py-6", className)}>
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.number
        const isCurrent = currentStep === step.number
        const isPending = currentStep < step.number

        return (
          <div key={step.number} className="flex items-center">
            {/* Step indicator */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-semibold shadow-sm transition-all sm:size-10",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "border-2 border-primary bg-primary/10 text-primary",
                  isPending && "border-2 border-border bg-card text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-4 sm:size-5" /> : step.number}
              </div>
              {/* Label: always show current step on mobile, all on sm+ */}
              <span
                className={cn(
                  "text-xs font-medium transition-colors sm:text-sm",
                  isCurrent ? "block" : "hidden sm:block",
                  (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px rounded-full transition-colors sm:mx-4 sm:w-16 md:w-24 lg:w-32",
                  "w-8",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
