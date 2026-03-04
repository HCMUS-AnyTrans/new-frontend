"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FileUp, Coins } from "lucide-react";
import { BuyCreditsDialog } from "./buy-credits-dialog";
import { trackEvent } from "@/lib/analytics";

export function QuickActions() {
  const t = useTranslations("dashboard.quickActions");

  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
        <Link href="/documents">
          <FileUp className="size-4" />
          {t("uploadDocument")}
        </Link>
      </Button>
      <BuyCreditsDialog>
        <Button
          variant="outline"
          className="gap-2 border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary cursor-pointer"
          onClick={() => {
            trackEvent("buy_credit_click", {
              source: "dashboard_quick_actions",
            })
          }}
        >
          <Coins className="size-4" />
          {t("buyCredits")}
        </Button>
      </BuyCreditsDialog>
    </div>
  );
}
