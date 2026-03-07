import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import {
  ContactForm,
  ContactInfoPanel,
  ContactHero,
} from "@/features/contact";

export const metadata: Metadata = {
  title: "Liên hệ | AnyTrans",
  description:
    "Liên hệ với AnyTrans để được hỗ trợ, hợp tác hoặc tư vấn giải pháp dịch thuật AI cho doanh nghiệp.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default function ContactPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <ContactHero />

      <div className="flex justify-center bg-background px-4 py-16 lg:px-8 lg:py-24">
        <div className="w-full max-w-[1196px] overflow-hidden rounded-[10px] border border-border/60 bg-card p-2 shadow-[0px_0px_60px_30px_rgba(0,0,0,0.03)] dark:border-border/80 dark:shadow-[0px_0px_60px_20px_rgba(0,0,0,0.28)]">
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
  );
}
