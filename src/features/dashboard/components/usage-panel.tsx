"use client";

import { useTranslations, useLocale } from "next-intl";
import { CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreditsChart, useStorage } from "../hooks";
import {
  DashboardCard,
  DashboardCardContent,
  DashboardCardHeader,
} from "./dashboard-card";

const FILL_COLORS = ["var(--color-chart-1)", "var(--color-chart-3)"];

function UsagePanelSkeleton() {
  return (
    <DashboardCard className="h-full">
      <DashboardCardHeader>
        <Skeleton className="h-5 w-24" />
      </DashboardCardHeader>
      <DashboardCardContent className="flex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="mx-auto h-[80px] w-full max-w-[140px] rounded-lg sm:h-[100px] sm:max-w-[180px]" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-28" />
        </div>
      </DashboardCardContent>
    </DashboardCard>
  );
}

export function UsagePanel() {
  const tCharts = useTranslations("dashboard.charts");
  const tStorage = useTranslations("dashboard.storage");
  const locale = useLocale();
  const isMobile = useIsMobile();
  const {
    creditsData,
    isLoading: creditsLoading,
    isError: creditsError,
  } = useCreditsChart();
  const {
    storage,
    isLoading: storageLoading,
    isError: storageError,
  } = useStorage();

  const isLoading = creditsLoading || storageLoading;
  if (isLoading) return <UsagePanelSkeleton />;

  const hasCredits = creditsData && !creditsError;
  const hasStorage = storage && !storageError;

  const creditUsageData = hasCredits
    ? creditsData!.breakdown.map((item, index) => ({
        name: item.name === "Documents" ? tCharts("documents") : item.name,
        value: item.value,
        fill: FILL_COLORS[index] || FILL_COLORS[0],
      }))
    : [];
  const totalUsed = hasCredits ? creditsData!.usage.documentsUsed : 0;
  const total = creditUsageData.reduce((acc, d) => acc + d.value, 0);

  const chartConfig = {
    value: { label: "Credits", color: "var(--color-chart-1)" },
  } satisfies ChartConfig;

  return (
    <DashboardCard className="h-full">
      <DashboardCardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {tCharts("creditAllocation")}
        </CardTitle>
      </DashboardCardHeader>
      <DashboardCardContent className="flex flex-col gap-6">
        {/* Credit Allocation */}
        <div>
          {!hasCredits || totalUsed === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
              <Info className="size-6 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">
                {tCharts("noUsageInfo")}
              </p>
            </div>
          ) : (
            <>
              <ChartContainer
                config={chartConfig}
                className="mx-auto h-[80px] w-full max-w-[140px] sm:h-[100px] sm:max-w-[180px] md:h-[120px]"
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `${value?.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} ${name}`,
                          "",
                        ]}
                      />
                    }
                  />
                  <Pie
                    data={creditUsageData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 24 : 28}
                    outerRadius={isMobile ? 40 : 48}
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {creditUsageData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-2 flex flex-col gap-1.5">
                {creditUsageData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-sm"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium tabular-nums text-foreground">
                      {item.value.toLocaleString(
                        locale === "vi" ? "vi-VN" : "en-US",
                      )}
                      {total > 0 && (
                        <span className="ml-1 text-muted-foreground">
                          ({Math.round((item.value / total) * 100)}%)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Storage */}
        <div className="border-t border-border pt-4">
          <CardTitle className="mb-0 flex items-center gap-2 text-base font-semibold text-foreground">
            {tStorage("title")}
          </CardTitle>
          {!hasStorage ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {tCharts("noUsageInfo")}
            </p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex min-w-0 items-end justify-between gap-2">
                <span className="text-base font-bold tabular-nums text-foreground sm:text-lg">
                  {storage!.used} {storage!.unit}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  / {storage!.total} {storage!.unit} ({storage!.percentage}%)
                </span>
              </div>
              <Progress value={storage!.percentage} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {tStorage("remaining", {
                  value: (storage!.total - storage!.used).toFixed(1),
                })}
              </p>
            </div>
          )}
        </div>
      </DashboardCardContent>
    </DashboardCard>
  );
}
