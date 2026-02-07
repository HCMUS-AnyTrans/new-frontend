"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";
import { mockStorage } from "../data";

export function StorageUsage() {
  const t = useTranslations("dashboard.storage");
  const percentage = Math.round((mockStorage.used / mockStorage.total) * 100);
  const remaining = (mockStorage.total - mockStorage.used).toFixed(1);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          {t("title")}
        </CardTitle>
        <HardDrive className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {mockStorage.used} GB
              </span>
              <span className="text-sm text-muted-foreground">
                {" "}
                / {mockStorage.total} GB
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground tabular-nums">
              {percentage}%
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {t("remaining", { value: remaining })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
