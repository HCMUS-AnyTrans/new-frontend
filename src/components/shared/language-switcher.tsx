"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguageSync } from "@/features/settings/hooks";

export function LanguageSwitcher() {
  const { locale, toggleLanguage } = useLanguageSync();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative hover:bg-transparent dark:hover:bg-transparent"
      title={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
    >
      {locale === "vi" ? (
        <Image
          src="/vietnam-flag.svg"
          alt="Tiếng Việt"
          fill
          className="object-contain"
        />
      ) : (
        <Image
          src="/uk-flag.svg"
          alt="English"
          fill
          className="object-contain"
        />
      )}
      <span className="sr-only">
        {locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
      </span>
    </Button>
  );
}
