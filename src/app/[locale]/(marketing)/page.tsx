import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import {
  HeroSection,
  PainPoints,
  FeaturesSection,
  HowItWorks,
  PricingSection,
  TestimonialsSection,
  SocialProof,
} from "@/components/landing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <SocialProof />
      <PainPoints />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <TestimonialsSection />
    </>
  );
}
