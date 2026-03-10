"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Coins, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditPackageCard } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreditPackages } from "@/features/settings";
import { trackEvent } from "@/lib/analytics";
import {
  createCreditPackageFormatter,
  createCreditPackageViewModels,
  sortActiveCreditPackages,
} from "@/lib/credit-package";
import { useWallet } from "../hooks";

type BuyCreditsDialogProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function BuyCreditsDialog({
  children,
  open: openProp,
  onOpenChange,
}: BuyCreditsDialogProps) {
  const router = useRouter();
  const t = useTranslations("dashboard.buyCreditsDialog");
  const tQuickActions = useTranslations("dashboard.quickActions");
  const locale = useLocale();
  const { formatCredits, formatAmount, formatPerCredit } = useMemo(
    () => createCreditPackageFormatter(locale),
    [locale],
  );
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );

  const open = openProp ?? internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (openProp === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const { wallet } = useWallet();
  const { packages, isLoading, isError, refetch } = useCreditPackages();

  const packageList = useMemo(() => sortActiveCreditPackages(packages), [packages]);
  const packageViews = useMemo(
    () => createCreditPackageViewModels(packages),
    [packages],
  );

  const defaultPackageId = useMemo(() => {
    if (packageList.length === 0) return null;
    const bestValue = packageList.find((pkg) => pkg.tags.includes("best-value"));
    return (
      bestValue?.id ??
      packageList[Math.floor(packageList.length / 2)]?.id ??
      packageList[0]?.id ??
      null
    );
  }, [packageList]);

  const effectiveSelectedPackageId = selectedPackageId ?? defaultPackageId;

  const selectedPackage = useMemo(() => {
    if (!effectiveSelectedPackageId) return null;
    return packageViews.find((pkg) => pkg.id === effectiveSelectedPackageId) ?? null;
  }, [packageViews, effectiveSelectedPackageId]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        handleOpenChange(nextOpen);
        if (nextOpen) {
          setSelectedPackageId(null);
        }
      }}
    >
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="size-5 text-primary" />
            {t("title")}
          </DialogTitle>
            <DialogDescription>
              {t("description", {
                balance: formatCredits(wallet?.balance ?? 0),
              })}
            </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-xl border p-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-4 h-7 w-28" />
                <Skeleton className="mt-2 h-5 w-20" />
                <Skeleton className="mt-4 h-9 w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">{t("loadError")}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => refetch()}
            >
              {t("retry")}
            </Button>
          </div>
        ) : packageList.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/pricing">{t("viewPricing")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {packageViews.map((pkg) => {
              const isSelected = pkg.id === effectiveSelectedPackageId;

              return (
                <CreditPackageCard
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPackageId(pkg.id);
                    trackEvent("buy_credit_package_selected", {
                      source: "dashboard_dialog",
                      packageId: pkg.id,
                      credits: pkg.credits,
                      price: pkg.price,
                      currency: pkg.currency,
                    });
                  }}
                  selected={isSelected}
                  title={pkg.name}
                  creditsText={formatCredits(pkg.credits)}
                  creditsLabel={t("credits")}
                  bonusText={
                    pkg.bonusCredits
                      ? t("bonusCredits", {
                          credits: formatCredits(pkg.bonusCredits),
                        })
                      : undefined
                  }
                  originalPriceText={
                    pkg.discountPercent
                      ? formatAmount(pkg.price, pkg.currency)
                      : undefined
                  }
                  priceText={formatAmount(pkg.discountedPrice, pkg.currency)}
                  perCreditText={formatPerCredit(pkg.unitPrice, pkg.currency, t("perCredit"))}
                  topBadge={
                    pkg.isBestValue
                      ? {
                          label: t("bestValue"),
                          icon: <Star className="size-3" />,
                          tone: "warning",
                          placement: "top-right",
                        }
                      : pkg.isPopular
                        ? {
                            label: t("popular"),
                            tone: "secondary",
                            placement: "top-right",
                          }
                        : undefined
                  }
                />
              );
            })}
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" asChild>
            <Link href="/pricing">{t("viewPricing")}</Link>
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="ghost" onClick={() => handleOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button
              disabled={!selectedPackage}
              onClick={() => {
                if (!selectedPackage) return;
                trackEvent("buy_credit_checkout_started", {
                  source: "dashboard_dialog",
                  packageId: selectedPackage.id,
                });
                handleOpenChange(false);
                router.push(
                  `/checkout?packageId=${selectedPackage.id}&source=dashboard`,
                );
              }}
            >
              {tQuickActions("buyCredits")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
