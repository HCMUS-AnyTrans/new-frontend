import {
  HeroSection,
  PainPoints,
  FeaturesSection,
  HowItWorks,
  PricingSection,
  TestimonialsSection,
  SocialProof,
} from "@/components/landing"

export default function Home() {
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
  )
}
