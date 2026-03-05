"use client";

import { useTranslations } from "next-intl";
import { CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useJobsChart } from "../hooks";
import {
  DashboardCard,
  DashboardCardContent,
  DashboardCardHeader,
} from "./dashboard-card";

function JobsChartSkeleton() {
  return (
    <DashboardCard className="h-full">
      <DashboardCardHeader>
        <Skeleton className="h-5 w-40" />
      </DashboardCardHeader>
      <DashboardCardContent>
        <Skeleton className="h-[280px] w-full rounded-md" />
        <div className="mt-3 flex items-center justify-center gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </DashboardCardContent>
    </DashboardCard>
  );
}

export function JobsChart() {
  const t = useTranslations("dashboard.charts");
  const { chartData, isLoading, isError } = useJobsChart();

  const chartConfig = {
    document: {
      label: t("documents"),
      color: "var(--color-chart-1)",
    },
  } satisfies ChartConfig;

  if (isLoading) return <JobsChartSkeleton />;
  if (isError || !chartData) return <JobsChartSkeleton />;

  return (
    <DashboardCard className="h-full">
      <DashboardCardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {t("jobsByDay")}
        </CardTitle>
      </DashboardCardHeader>
      <DashboardCardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent labelFormatter={(value) => `${value}`} />
              }
            />
            <Bar
              dataKey="document"
              fill="var(--color-document)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ChartContainer>
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-sm bg-chart-1" />
            <span className="text-xs text-muted-foreground">
              {t("documents")}
            </span>
          </div>
        </div>
      </DashboardCardContent>
    </DashboardCard>
  );
}
