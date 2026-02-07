import { defineRouting } from "next-intl/routing";

export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "vi",

  // Locale prefix strategy: 'always' | 'as-needed' | 'never'
  // 'as-needed' - default locale doesn't have prefix, others do
  localePrefix: "as-needed",
});
