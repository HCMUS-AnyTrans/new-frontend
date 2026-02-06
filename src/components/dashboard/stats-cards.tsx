"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Coins, FileText, Clock, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
import { mockStats } from "@/data/dashboard"

const stats = [
  {
    title: "Tổng credits",
    value: mockStats.totalCredits.toLocaleString("vi-VN"),
    change: mockStats.creditsChange,
    trend: mockStats.creditsTrend,
    trendLabel: "so với tháng trước",
    icon: Coins,
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
  },
  {
    title: "Tổng số jobs",
    value: mockStats.totalJobs.toString(),
    change: mockStats.jobsChange,
    trend: mockStats.jobsTrend,
    trendLabel: "so với tháng trước",
    icon: FileText,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    subtitle: `${mockStats.documentJobs} Tài liệu  |  ${mockStats.subtitleJobs} Phụ đề`,
  },
  {
    title: "Đang xử lý",
    value: mockStats.processingJobs.toString(),
    change: mockStats.processingChange,
    trend: mockStats.processingTrend,
    trendLabel: "so với hôm qua",
    icon: Clock,
    iconColor: "text-info",
    iconBg: "bg-info/10",
  },
  {
    title: "Hoàn thành tháng này",
    value: mockStats.completedThisMonth.toString(),
    change: mockStats.completedChange,
    trend: mockStats.completedTrend,
    trendLabel: "so với tháng trước",
    icon: CheckCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    subtitle: `Tỉ lệ thành công: ${mockStats.successRate}%`,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  {stat.title}
                </span>
                <span className="text-2xl font-bold text-foreground tracking-tight tabular-nums">
                  {stat.value}
                </span>
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                <stat.icon className={`size-5 ${stat.iconColor}`} />
              </div>
            </div>
            {stat.subtitle && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {stat.subtitle}
              </p>
            )}
            <div className="mt-3 flex items-center gap-1">
              {stat.trend === "up" ? (
                <TrendingUp className="size-3.5 text-success" />
              ) : stat.trend === "down" ? (
                <TrendingDown className="size-3.5 text-info" />
              ) : null}
              <span
                className={`text-xs font-medium ${
                  stat.trend === "up"
                    ? "text-success"
                    : stat.trend === "down"
                    ? "text-info"
                    : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.trendLabel}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
