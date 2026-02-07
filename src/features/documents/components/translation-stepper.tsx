"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TranslationStep } from "../types"

interface Step {
  number: TranslationStep
  label: string
}

const steps: Step[] = [
  { number: 1, label: "Tải lên" },
  { number: 2, label: "Cấu hình" },
  { number: 3, label: "Xem trước" },
]

interface TranslationStepperProps {
  currentStep: TranslationStep
  className?: string
}

export function TranslationStepper({ currentStep, className }: TranslationStepperProps) {
  return (
    <div className={cn("flex items-center justify-center py-6", className)}>
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.number
        const isCurrent = currentStep === step.number
        const isPending = currentStep < step.number

        return (
          <div key={step.number} className="flex items-center">
            {/* Step indicator */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full text-sm font-semibold shadow-sm transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "border-2 border-primary bg-primary/10 text-primary",
                  isPending && "border-2 border-border bg-card text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-5" /> : step.number}
              </div>
              <span
                className={cn(
                  "font-medium transition-colors",
                  (isCompleted || isCurrent) && "text-foreground",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 hidden h-1 w-16 rounded-full transition-colors sm:block md:w-24 lg:w-32",
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
