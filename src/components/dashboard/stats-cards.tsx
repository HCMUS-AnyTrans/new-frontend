"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Coins, FileText, Clock, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
import { mockStats } from "@/data/dashboard"

const stats = [
  {
    title: "Tổng credits",
    value: mockStats.totalCredits.toLocaleString("vi-VN"),
    subtitle: "Số dư hiện tại",
    change: mockStats.creditsChange,
    trend: mockStats.creditsTrend,
    trendLabel: "so với tháng trước",
    icon: Coins,
    iconBg: "bg-secondary-100",
    iconColor: "text-secondary-700",
  },
  {
    title: "Tổng số jobs",
    value: mockStats.totalJobs.toString(),
    subtitle: `${mockStats.documentJobs} Tài liệu  |  ${mockStats.subtitleJobs} Phụ đề`,
    change: mockStats.jobsChange,
    trend: mockStats.jobsTrend,
    trendLabel: "so với tháng trước",
    icon: FileText,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-700",
  },
  {
    title: "Đang xử lý",
    value: mockStats.processingJobs.toString(),
    subtitle: "Jobs đang chờ",
    change: mockStats.processingChange,
    trend: mockStats.processingTrend,
    trendLabel: "so với hôm qua",
    icon: Clock,
    iconBg: "bg-accent-100",
    iconColor: "text-accent-700",
  },
  {
    title: "Hoàn thành tháng này",
    value: mockStats.completedThisMonth.toString(),
    subtitle: `Tỉ lệ thành công: ${mockStats.successRate}%`,
    change: mockStats.completedChange,
    trend: mockStats.completedTrend,
    trendLabel: "so với tháng trước",
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-muted/30"
        >
          <CardContent className="p-6">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent via-transparent to-muted/20 rounded-full blur-2xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              {/* Header with icon */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ring-4 ring-white shadow-sm group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`size-6 ${stat.iconColor}`} />
                </div>

                {/* Trend badge */}
                <div
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${
                    stat.trend === "up"
                      ? "bg-success/10 text-success"
                      : stat.trend === "down"
                      ? "bg-info/10 text-info"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="size-3" />
                  ) : stat.trend === "down" ? (
                    <TrendingDown className="size-3" />
                  ) : null}
                  <span className="text-xs font-semibold tabular-nums">
                    {stat.change}
                  </span>
                </div>
              </div>

              {/* Main content */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-foreground tracking-tight tabular-nums">
                  {stat.value}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/70">
                    {stat.trendLabel}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
