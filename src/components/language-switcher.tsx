"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, type Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, { name: string; flag: string }> = {
  vi: { name: "Tiếng Việt", flag: "🇻🇳" },
  en: { name: "English", flag: "🇺🇸" },
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove current locale prefix and add new one
    const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "");
    const newPath = `/${newLocale}${pathnameWithoutLocale || ""}`;
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="size-5 text-muted-foreground" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={locale === loc ? "bg-muted" : ""}
          >
            <span className="mr-2">{localeLabels[loc].flag}</span>
            {localeLabels[loc].name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
