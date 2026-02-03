"use client"

import { motion } from "framer-motion"
import { FileX2, Clock, Wallet, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PainPoint {
  icon: React.ReactNode
  title: string
  description: string
}

export interface PainPointsProps {
  headline?: {
    title: string
    subtitle?: string
  }
  painPoints?: PainPoint[]
  className?: string
}

const defaultPainPoints: PainPoint[] = [
  {
    icon: <FileX2 className="w-8 h-8" />,
    title: "Mất format khi dịch PDF",
    description: "Bảng biểu, hình ảnh, layout bị phá vỡ hoàn toàn sau khi dịch",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Tốn quá nhiều thời gian",
    description: "Dịch thủ công mất hàng giờ, thậm chí hàng ngày cho tài liệu dài",
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Chi phí dịch thuật cao",
    description: "Thuê dịch giả chuyên nghiệp tốn kém, không phù hợp ngân sách",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
}

export function PainPoints({
  headline = {
    title: "Bạn có đang gặp những rắc rối này?",
    subtitle: "Đây là những vấn đề mà hàng nghìn người dùng đã từng trải qua trước khi tìm đến AnyTrans",
  },
  painPoints = defaultPainPoints,
  className,
}: PainPointsProps) {
  return (
    <section
      className={cn(
        "relative py-20 lg:py-28 overflow-hidden",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30 dark:bg-muted/10" />
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--primary-500)_1px,transparent_0)] bg-[size:32px_32px] opacity-[0.03]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14 lg:mb-20"
        >

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {headline.title}
          </h2>
          {headline.subtitle && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {headline.subtitle}
            </p>
          )}
        </motion.div>

        {/* Pain Points Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {painPoints.map((point, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group relative h-full border-0 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Accent top border */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-destructive/60 via-destructive to-destructive/60 rounded-t-lg" />
                
                <CardContent className="pt-8 pb-6 px-6">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-destructive/10 text-destructive mb-5 group-hover:scale-110 transition-transform duration-300">
                    {point.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
