import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AboutCTAProps {
  className?: string
}

export function AboutCTA({ className }: AboutCTAProps) {
  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-700 dark:from-primary-600 dark:to-primary-900 p-8 lg:p-16 text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Tham gia cùng hơn 10.000 khách hàng đang sử dụng AnyTrans để dịch
              tài liệu chuyên nghiệp
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold"
              >
                Dùng thử miễn phí
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-semibold"
              >
                Liên hệ tư vấn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
