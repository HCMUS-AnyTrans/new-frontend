import { Metadata } from "next"
import { ContactForm, ContactInfoPanel, ContactHero } from "@/components/contact"

export const metadata: Metadata = {
  title: "Liên hệ | AnyTrans",
  description: "Liên hệ với AnyTrans để được hỗ trợ, hợp tác hoặc tư vấn giải pháp dịch thuật AI cho doanh nghiệp.",
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      
      <div className="bg-white py-16 px-4 lg:py-24 lg:px-8 flex justify-center">
        <div className="w-full max-w-[1196px] bg-white rounded-[10px] shadow-[0px_0px_60px_30px_rgba(0,0,0,0.03)] overflow-hidden p-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Info Panel (Left) - 5 cols */}
            <div className="lg:col-span-5 h-full">
              <ContactInfoPanel />
            </div>
            
            {/* Form (Right) - 7 cols */}
            <div className="lg:col-span-7 h-full">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
