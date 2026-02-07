"use client"

import { useTranslations } from "next-intl"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface Logo {
  name: string
  width: number
}

interface SocialProofProps {
  logos?: Logo[]
  className?: string
}

const defaultLogos: Logo[] = [
  { name: "Acme Corp", width: 100 },
  { name: "Globex", width: 90 },
  { name: "Initech", width: 95 },
  { name: "Umbrella", width: 105 },
  { name: "Stark Inc", width: 100 },
  { name: "Wayne Co", width: 95 },
  { name: "Cyberdyne", width: 110 },
  { name: "Aperture", width: 100 },
]

function LogoPlaceholder({ name, width }: Logo) {
  return (
    <div
      className="flex items-center justify-center h-12 px-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
      style={{ minWidth: width }}
    >
      <span className="text-xl font-bold text-muted-foreground hover:text-primary transition-colors tracking-tight">
        {name}
      </span>
    </div>
  )
}

export function SocialProof({
  logos = defaultLogos,
  className,
}: SocialProofProps) {
  const t = useTranslations("marketing.socialProof")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      ref={ref}
      className={cn(
        "relative py-16 bg-background border-y border-border overflow-hidden",
        className
      )}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-10"
        >
          {t("title")}
        </motion.p>

        {/* Desktop: Grid */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center flex-wrap gap-x-12 gap-y-8"
          >
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <LogoPlaceholder name={logo.name} width={logo.width} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile: Marquee */}
        <div className="md:hidden overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 items-center"
          >
            {[...logos, ...logos].map((logo, index) => (
              <LogoPlaceholder
                key={`${logo.name}-${index}`}
                name={logo.name}
                width={logo.width}
              />
            ))}
          </motion.div>
        </div>

        {/* Mock indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-xs text-muted-foreground/50 mt-8 italic"
        >
          {t("disclaimer")}
        </motion.p>
      </div>
    </section>
  )
}
