import { Header, HeroSection, PainPoints, FeaturesSection, HowItWorks, PricingSection, TestimonialsSection, Footer } from "@/components/layout";
import { SocialProof } from "@/components/shared";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SocialProof />
      <PainPoints />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
