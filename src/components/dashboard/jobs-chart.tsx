"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { mockJobsChartData } from "@/data/dashboard"

const chartConfig = {
  document: {
    label: "Tài liệu",
    color: "var(--color-chart-1)",
  },
  subtitle: {
    label: "Phụ đề",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig

export function JobsChart() {
  return (
    <Card className="h-full border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Jobs theo ngày (7 ngày gần nhất)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={mockJobsChartData} barGap={4}>
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
                <ChartTooltipContent
                  labelFormatter={(value) => `${value}`}
                />
              }
            />
            <Bar
              dataKey="document"
              fill="var(--color-document)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="subtitle"
              fill="var(--color-subtitle)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ChartContainer>
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-sm bg-chart-1" />
            <span className="text-xs text-muted-foreground">Tài liệu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-sm bg-chart-3" />
            <span className="text-xs text-muted-foreground">Phụ đề</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
