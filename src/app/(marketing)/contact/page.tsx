import { Metadata } from "next"
import {
  ContactHero,
  ContactForm,
  ContactInfoPanel,
} from "@/components/contact"

export const metadata: Metadata = {
  title: "Liên hệ | AnyTrans",
  description:
    "Liên hệ với AnyTrans để được hỗ trợ, hợp tác hoặc tư vấn giải pháp dịch thuật AI cho doanh nghiệp.",
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      {/* Split Screen Section */}
      <section className="py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContactForm />
            <ContactInfoPanel />
          </div>
        </div>
      </section>
    </>
  )
}
