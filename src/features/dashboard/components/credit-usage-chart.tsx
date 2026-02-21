"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Info } from "lucide-react";
import { useCreditsChart } from "../hooks";

function CreditUsageChartSkeleton() {
  return (
    <Card className="h-full border border-border shadow-sm">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="mx-auto h-[200px] w-[200px] rounded-full" />
        <div className="mt-2 flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const FILL_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-3)",
];

export function CreditUsageChart() {
  const t = useTranslations("dashboard.charts");
  const locale = useLocale();
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
    <Card className="h-full border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          {t("creditAllocation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasUsage ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Info className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {t("noUsageInfo")}
            </p>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto h-[200px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        value?.toLocaleString(locale === "vi" ? "vi-VN" : "en-US"),
                        name,
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
                  innerRadius={50}
                  outerRadius={80}
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
                        locale === "vi" ? "vi-VN" : "en-US"
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
