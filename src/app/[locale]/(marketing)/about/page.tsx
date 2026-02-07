import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { BannerCTA } from "@/components/shared";
import {
  AboutHero,
  OurStory,
  CoreValues,
  TimelineSection,
  TeamSection,
} from "@/features/about";

export const metadata: Metadata = {
  title: "Về chúng tôi | AnyTrans",
  description:
    "AnyTrans là nền tảng dịch thuật AI tiên tiến, giúp bạn dịch tài liệu chuyên nghiệp với độ chính xác cao và giữ nguyên định dạng gốc.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default function AboutPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      <OurStory />
      <CoreValues />
      <TimelineSection />
      <TeamSection />
      <BannerCTA />
    </>
  );
}
