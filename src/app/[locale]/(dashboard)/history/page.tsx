"use client";

import { History } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppCard, AppCardContent } from "@/components/ui/app-card";
import { HistoryContent } from "@/features/history";

export default function HistoryPage() {
  const t = useTranslations("dashboard.history");

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <AppCard>
        <AppCardContent padding="all" className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <History className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </AppCardContent>
      </AppCard>

      <HistoryContent />
    </div>
  );
}
