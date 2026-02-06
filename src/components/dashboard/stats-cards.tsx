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
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
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
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                <stat.icon className={`size-6 ${stat.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <p className="text-sm text-muted-foreground truncate">
                  {stat.title}
                </p>

                {/* Value */}
                <p className="text-2xl font-bold text-foreground tracking-tight tabular-nums">
                  {stat.value}
                </p>

                {/* Subtitle (if exists) */}
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {stat.subtitle}
                  </p>
                )}

                {/* Trend */}
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="size-3.5 text-success" />
                  ) : stat.trend === "down" ? (
                    <TrendingDown className="size-3.5 text-accent" />
                  ) : null}
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up"
                        ? "text-success"
                        : stat.trend === "down"
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.trendLabel}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
