"use client"

import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { SectionBadge } from "@/components/shared"
import { cn } from "@/lib/utils"

export interface ContactHeroProps {
  className?: string
}

export function ContactHero({ className }: ContactHeroProps) {
  return (
    <section
      className={cn(
        "relative pt-20 pb-12 lg:pt-28 lg:pb-16 overflow-hidden",
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background dark:from-primary-950/30 dark:via-background" />

      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl dark:bg-primary-800/20" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-secondary-200/20 rounded-full blur-3xl dark:bg-secondary-800/10" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionBadge
            text="Liên hệ chúng tôi"
            icon={MessageSquare}
            variant="primary"
            className="mb-4"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4"
        >
          Bắt đầu một{" "}
          <span className="text-primary">cuộc trò chuyện</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Chúng tôi ở đây để giúp bạn. Gửi tin nhắn và chúng tôi sẽ phản hồi
          trong vòng 24 giờ.
        </motion.p>
      </div>
    </section>
  )
}
