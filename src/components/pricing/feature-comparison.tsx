"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { featureComparison, pricingPlans } from "@/data/pricing"

export interface FeatureComparisonProps {
  className?: string
}

export function FeatureComparison({ className }: FeatureComparisonProps) {
  const renderValue = (value: boolean | string, isPopular: boolean = false) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-primary mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
      )
    }
    return (
      <span className={cn(isPopular ? "text-primary" : "text-muted-foreground")}>
        {value}
      </span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                Tính năng
              </th>
              {pricingPlans.map((plan) => (
                <th
                  key={plan.id}
                  className={cn(
                    "text-center py-4 px-4 font-medium",
                    plan.popular
                      ? "text-primary bg-primary/5 rounded-t-lg"
                      : "text-muted-foreground"
                  )}
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureComparison.map((row, idx) => (
              <tr key={idx} className="border-b border-border/50">
                <td className="py-4 px-4 text-foreground">{row.feature}</td>
                <td className="text-center py-4 px-4">
                  {renderValue(row.starter)}
                </td>
                <td className="text-center py-4 px-4 bg-primary/5">
                  {renderValue(row.popular, true)}
                </td>
                <td className="text-center py-4 px-4">
                  {renderValue(row.pro)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
