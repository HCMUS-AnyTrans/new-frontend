"use client"

import { useTranslations } from "next-intl"
import { Mail, Phone, MapPin, Twitter, Instagram, DiscIcon } from "lucide-react"

export function ContactInfoPanel() {
  const t = useTranslations("marketing.contact.infoPanel")

  return (
    <div className="relative bg-primary rounded-[10px] p-10 overflow-hidden h-full flex flex-col justify-between min-h-[600px]">
      {/* Decorative Circles */}
      <div className="absolute bottom-[-50px] right-[-50px] w-[269px] h-[269px] bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-[20px] right-[20px] w-[138px] h-[138px] bg-white/10 rounded-full pointer-events-none" />

      {/* Header */}
      <div>
        <h2 className="text-primary-foreground text-[28px] font-semibold mb-2">
          {t("title")}
        </h2>
        <p className="text-primary-foreground/80 text-lg">
          {t("subtitle")}
        </p>
      </div>

      {/* Info List */}
      <div className="space-y-12 relative z-10">
        <div className="flex items-center gap-6">
          <Phone className="w-6 h-6 text-primary-foreground" />
          <span className="text-primary-foreground text-base">+84 123 456 789</span>
        </div>
        <div className="flex items-center gap-6">
          <Mail className="w-6 h-6 text-primary-foreground" />
          <span className="text-primary-foreground text-base">demo@gmail.com</span>
        </div>
        <div className="flex items-start gap-6">
          <MapPin className="w-6 h-6 text-primary-foreground mt-1" />
          <span className="text-primary-foreground text-base max-w-[250px]">
            132 Dartmouth Street Boston, Massachusetts 02156 United States
          </span>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex gap-4 relative z-10">
        <a href="#" className="w-[30px] h-[30px] bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
          <Twitter className="w-4 h-4 text-primary-foreground" />
        </a>
        <a href="#" className="w-[30px] h-[30px] bg-primary-foreground rounded-full flex items-center justify-center hover:bg-primary-foreground/90 transition-colors">
          <Instagram className="w-4 h-4 text-primary" />
        </a>
        <a href="#" className="w-[30px] h-[30px] bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
          <DiscIcon className="w-4 h-4 text-primary-foreground" />
        </a>
      </div>
    </div>
  )
}
