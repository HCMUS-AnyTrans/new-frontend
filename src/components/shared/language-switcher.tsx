"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const handleToggleLocale = () => {
    const newLocale: Locale = locale === "vi" ? "en" : "vi";
    // Remove current locale prefix and add new one
    const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "");
    const newPath = `/${newLocale}${pathnameWithoutLocale || ""}`;
    router.push(newPath);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleLocale}
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
