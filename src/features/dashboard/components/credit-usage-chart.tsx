"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";

export function CreditUsageChart() {
  const t = useTranslations("dashboard.charts");
  const locale = useLocale();

  // Create localized data
  const creditUsageData = [
    {
      name: t("documents"),
      value: 8200,
      fill: "var(--color-chart-1)",
    },
    {
      name: t("subtitles"),
      value: 3800,
      fill: "var(--color-chart-3)",
    },
    {
      name: t("remaining"),
      value: 12450,
      fill: "var(--color-chart-2)",
    },
  ];

  const chartConfig = {
    value: {
      label: "Credits",
      color: "var(--color-chart-1)",
    },
  } satisfies ChartConfig;

  const total = creditUsageData.reduce((acc, d) => acc + d.value, 0);

  return (
    <Card className="h-full border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          {t("creditAllocation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
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
                  ({Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
