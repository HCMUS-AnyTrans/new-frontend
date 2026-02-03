import { Metadata } from "next"
import { BannerCTA } from "@/components/shared"
import {
  AboutHero,
  OurStory,
  CoreValues,
  TimelineSection,
  TeamSection,
} from "@/components/about"

export const metadata: Metadata = {
  title: "Về chúng tôi | AnyTrans",
  description:
    "AnyTrans là nền tảng dịch thuật AI tiên tiến, giúp bạn dịch tài liệu chuyên nghiệp với độ chính xác cao và giữ nguyên định dạng gốc.",
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <CoreValues />
      <TimelineSection />
      <TeamSection />
      <BannerCTA />
    </>
  )
}
