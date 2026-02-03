"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { pricingFAQ } from "@/data/pricing"

export interface PricingFAQProps {
  className?: string
}

export function PricingFAQ({ className }: PricingFAQProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Accordion type="single" collapsible className="space-y-4">
        {pricingFAQ.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border border-border rounded-lg px-4 bg-card"
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
    </motion.div>
  )
}
