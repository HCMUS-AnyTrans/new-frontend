"use client";

import { useTranslations, useLocale } from "next-intl";
import { CardTitle } from "@/components/ui/card";
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
import { useCreditsChart } from "../hooks";
import {
  DashboardCard,
  DashboardCardContent,
  DashboardCardHeader,
} from "./dashboard-card";

function CreditUsageChartSkeleton() {
  return (
    <DashboardCard className="h-full">
      <DashboardCardHeader>
        <Skeleton className="h-5 w-36" />
      </DashboardCardHeader>
      <DashboardCardContent>
        <Skeleton className="mx-auto h-[140px] w-full rounded-lg sm:h-[200px]" />
        <div className="mt-2 flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-2.5 shrink-0 rounded-sm" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          ))}
        </div>
      </DashboardCardContent>
    </DashboardCard>
  );
}

const FILL_COLORS = ["var(--color-chart-1)", "var(--color-chart-3)"];

export function CreditUsageChart() {
  const t = useTranslations("dashboard.charts");
  const locale = useLocale();
  const isMobile = useIsMobile();
  const { creditsData, isLoading, isError } = useCreditsChart();

  const chartConfig = {
    value: {
      label: "Credits",
      color: "var(--color-chart-1)",
    },
  } satisfies ChartConfig;

  if (isLoading) return <CreditUsageChartSkeleton />;
  if (isError || !creditsData) return <CreditUsageChartSkeleton />;

  const { usage } = creditsData;
  const totalUsed = usage.documentsUsed;
  const hasUsage = totalUsed > 0;

  // Map backend breakdown to chart data (Documents only)
  const nameMap: Record<string, string> = {
    Documents: t("documents"),
  };

  const creditUsageData = creditsData.breakdown.map((item, index) => ({
    name: nameMap[item.name] || item.name,
    value: item.value,
    fill: FILL_COLORS[index] || FILL_COLORS[0],
  }));

  const total = creditUsageData.reduce((acc, d) => acc + d.value, 0);

  return (
    <DashboardCard className="h-full">
      <DashboardCardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {t("creditAllocation")}
        </CardTitle>
      </DashboardCardHeader>
      <DashboardCardContent>
        {!hasUsage ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Info className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t("noUsageInfo")}</p>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto h-[140px] w-full sm:h-[200px]"
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
                  innerRadius={isMobile ? 32 : 50}
                  outerRadius={isMobile ? 55 : 80}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {creditUsageData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-2 flex flex-col gap-2">
              {creditUsageData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground tabular-nums">
                      {item.value.toLocaleString(
                        locale === "vi" ? "vi-VN" : "en-US",
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({total > 0 ? Math.round((item.value / total) * 100) : 0}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DashboardCardContent>
    </DashboardCard>
  );
}
