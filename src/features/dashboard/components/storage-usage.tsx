"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { HardDrive } from "lucide-react";
import { useStorage } from "../hooks";

function StorageUsageSkeleton() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-between">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StorageUsage() {
  const t = useTranslations("dashboard.storage");
  const { storage, isLoading, isError } = useStorage();

  if (isLoading) return <StorageUsageSkeleton />;
  if (isError || !storage) return <StorageUsageSkeleton />;

  const percentage = storage.percentage;
  const remaining = (storage.total - storage.used).toFixed(1);

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
                {storage.used} {storage.unit}
              </span>
              <span className="text-sm text-muted-foreground">
                {" "}
                / {storage.total} {storage.unit}
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
