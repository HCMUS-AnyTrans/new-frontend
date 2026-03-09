import type { CreditPackage } from "@/features/settings/types";
import { normalizePercentage } from "@/lib/percentage";

export interface CreditPackageViewModel {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  tags: string[];
  isBestValue: boolean;
  isPopular: boolean;
  discountPercent: number | null;
  bonusPercent: number | null;
  discountedPrice: number;
  bonusCredits: number;
  totalCredits: number;
  unitPrice: number;
}

export interface CreditPackageFormatter {
  formatCredits: (value: number) => string;
  formatAmount: (value: number, currency: string) => string;
  formatPerCredit: (value: number, currency: string, perCreditLabel: string) => string;
}

function getIntlLocale(locale: string) {
  return locale === "vi" ? "vi-VN" : "en-US";
}

function getCurrencySymbol(currency: string) {
  if (currency === "VND") return "đ";
  if (currency === "USD") return "$";
  return currency;
}

export function createCreditPackageFormatter(locale: string): CreditPackageFormatter {
  const intlLocale = getIntlLocale(locale);
  const creditsFormatter = new Intl.NumberFormat(intlLocale);
  const amountFormatter = new Intl.NumberFormat(intlLocale, {
    maximumFractionDigits: 2,
  });

  return {
    formatCredits: (value) => creditsFormatter.format(value),
    formatAmount: (value, currency) =>
      `${amountFormatter.format(value)} ${getCurrencySymbol(currency)}`,
    formatPerCredit: (value, currency, perCreditLabel) =>
      `~${amountFormatter.format(value)}${getCurrencySymbol(currency)}/${perCreditLabel}`,
  };
}

export function sortActiveCreditPackages(packages: CreditPackage[] | undefined) {
  return (packages ?? [])
    .filter((pkg) => pkg.active)
    .sort((a, b) => a.credits - b.credits);
}

export function createCreditPackageViewModel(
  pkg: Pick<
    CreditPackage,
    "id" | "name" | "credits" | "price" | "currency" | "bonus" | "discount" | "tags"
  >,
): CreditPackageViewModel {
  const discountPercent = normalizePercentage(pkg.discount);
  const bonusPercent = normalizePercentage(pkg.bonus);
  const discountedPrice = discountPercent
    ? Math.round(pkg.price * (1 - discountPercent / 100))
    : pkg.price;
  const bonusCredits = bonusPercent
    ? Math.round((pkg.credits * bonusPercent) / 100)
    : 0;

  return {
    id: pkg.id,
    name: pkg.name,
    credits: pkg.credits,
    price: pkg.price,
    currency: pkg.currency,
    tags: pkg.tags,
    isBestValue: pkg.tags.includes("best-value"),
    isPopular: pkg.tags.includes("popular"),
    discountPercent,
    bonusPercent,
    discountedPrice,
    bonusCredits,
    totalCredits: pkg.credits + bonusCredits,
    unitPrice: pkg.credits > 0 ? discountedPrice / pkg.credits : 0,
  };
}

export function createCreditPackageViewModels(
  packages: CreditPackage[] | undefined,
) {
  return sortActiveCreditPackages(packages).map(createCreditPackageViewModel);
}
