"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HeroBackground,
  SectionBackground,
  BannerCTA,
} from "@/components/shared";
import {
  PricingGrid,
  UsageExamples,
  EnterpriseBlock,
  PricingFAQ,
} from "@/features/pricing";
import { usageExamples } from "@/features/pricing/data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function PricingPage({ params }: Props) {
  // Note: setRequestLocale cannot be used in client components
  // The locale is already set in the parent layout
  const { locale } = use(params);
  const t = useTranslations("marketing.pricingPage");

  return (
    <>
      {/* Hero Section */}
      <HeroBackground>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 text-balance">
            {t("hero.title")}
            <br />
            <span className="text-primary">{t("hero.subtitle")}</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            {t("hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="shadow-lg shadow-primary/20 px-8 h-14 text-lg group"
              asChild
            >
              <Link href="/register" className="flex items-center gap-2">
                {t("cta")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-14 text-lg"
              asChild
            >
              <Link href="/demo">{t("ctaSecondary")}</Link>
            </Button>
          </div>
        </div>
      </HeroBackground>

      {/* Pricing Cards */}
      <SectionBackground
        background="transparent"
        showGrid
        gridSize="sm"
        className="py-16 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <PricingGrid />
        </div>
      </SectionBackground>

      {/* Usage Examples */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {t("usageSection.title")}
          </h2>
          <UsageExamples examples={usageExamples} />
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            {t("enterpriseSection.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            {t("enterpriseSection.description")}
          </p>
          <EnterpriseBlock variant="light" />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {t("faq.title")}
          </h2>
          <PricingFAQ />
        </div>
      </section>

      {/* Final CTA Banner */}
      <BannerCTA
        title={t("banner.title")}
        subtitle={t("banner.subtitle")}
        primaryButtonText={t("cta")}
        primaryButtonHref="/register"
        secondaryButtonText={t("ctaSecondary")}
        secondaryButtonHref="/demo"
      />
    </>
  );
}
