"use client"

import { useTranslations } from "next-intl"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
  question: string
  answer: string
}

export interface PricingFAQProps {
  className?: string
}

export function PricingFAQ({ className }: PricingFAQProps) {
  const t = useTranslations("marketing.pricingPage")
  const faqItems = t.raw("faqItems") as FAQItem[]

  return (
    <div className={className}>
      <Accordion type="single" collapsible className="space-y-4">
        {faqItems.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border border-border rounded-lg px-4 bg-card last:border-b"
          >
            <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
