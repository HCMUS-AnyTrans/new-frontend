import { Header, HeroSection, PainPoints } from "@/components/layout";
import { SocialProof } from "@/components/shared";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SocialProof />
      <PainPoints />
    </div>
  );
}
