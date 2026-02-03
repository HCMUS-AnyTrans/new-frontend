import Link from "next/link"
import { Zap, Lightbulb, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { contactPageInfo, contactPageSocialLinks } from "@/data/contact"

// ============================================================================
// CONTACT INFO CARD
// ============================================================================

function ContactInfoCard() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors duration-200">
      <CardContent className="p-6">
        <h3 className="text-foreground font-bold text-lg mb-4">
          Thông tin liên hệ
        </h3>
        <div className="space-y-0">
          {contactPageInfo.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-3 py-3",
                  index !== contactPageInfo.length - 1 && "border-b border-border"
                )}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {item.label}
                  </p>
                  <p className="text-muted-foreground text-sm">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RESPONSE TIME CARD
// ============================================================================

function ResponseTimeCard() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-l-[3px] border-primary border-t-primary/20 border-r-primary/20 border-b-primary/20 hover:border-primary/40 transition-colors duration-200">
      <CardContent className="p-6 flex items-center gap-4">
        <Zap className="w-6 h-6 text-primary" />
        <div>
          <p className="text-foreground font-semibold text-sm">
            Phản hồi nhanh
          </p>
          <p className="text-muted-foreground text-xs">Thông thường trong vòng</p>
          <p className="text-primary font-bold text-lg">{"< 24 giờ"}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SOCIAL LINKS CARD
// ============================================================================

function SocialLinksCard() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors duration-200">
      <CardContent className="p-6">
        <h3 className="text-foreground font-bold text-sm mb-3">
          Kết nối với chúng tôi
        </h3>
        <div className="space-y-2">
          {contactPageSocialLinks.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 group hover:bg-primary/5"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-muted border border-border group-hover:border-primary/30 group-hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-foreground text-sm">{social.name}</p>
                  <p className="text-muted-foreground text-xs">{social.handle}</p>
                </div>
              </a>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// FAQ TEASER CARD
// ============================================================================

function FAQTeaserCard() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-foreground text-sm font-semibold">
              Cần thêm thông tin?
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Xem bộ câu hỏi thường gặp của chúng tôi
            </p>
            <Link
              href="/pricing#faq"
              className="text-primary text-xs font-medium mt-2 inline-flex items-center gap-1 hover:underline"
            >
              Xem FAQ <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN INFO PANEL
// ============================================================================

export interface ContactInfoPanelProps {
  className?: string
}

export function ContactInfoPanel({ className }: ContactInfoPanelProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <ContactInfoCard />
      <ResponseTimeCard />
      <SocialLinksCard />
      <FAQTeaserCard />
    </div>
  )
}
