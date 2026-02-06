"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Pie, PieChart, Cell } from "recharts"
import { mockCreditUsageData } from "@/data/dashboard"

const chartConfig = {
  value: {
    label: "Credits",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig

const total = mockCreditUsageData.reduce((acc, d) => acc + d.value, 0)

export function CreditUsageChart() {
  return (
    <Card className="h-full border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Phân bổ credits
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="mx-auto h-[200px] w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    value?.toLocaleString("vi-VN"),
                    name,
                  ]}
                />
              }
            />
            <Pie
              data={mockCreditUsageData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
              stroke="hsl(var(--background))"
            >
              {mockCreditUsageData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 flex flex-col gap-2">
          {mockCreditUsageData.map((item) => (
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
                  {item.value.toLocaleString("vi-VN")}
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
  )
}
