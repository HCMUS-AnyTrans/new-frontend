"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import {
  Coins,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { mockStats } from "@/data/dashboard";

export function StatsCards() {
  const t = useTranslations("dashboard.stats");
  const locale = useLocale();

  const stats = [
    {
      title: t("totalCredits"),
      value: mockStats.totalCredits.toLocaleString(
        locale === "vi" ? "vi-VN" : "en-US"
      ),
      change: mockStats.creditsChange,
      trend: mockStats.creditsTrend,
      trendLabel: t("vsLastMonth"),
      icon: Coins,
      iconColor: "text-secondary",
      iconBg: "bg-secondary/10",
    },
    {
      title: t("totalJobs"),
      value: mockStats.totalJobs.toString(),
      change: mockStats.jobsChange,
      trend: mockStats.jobsTrend,
      trendLabel: t("vsLastMonth"),
      icon: FileText,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      subtitle: t("documentsAndSubtitles", {
        docs: mockStats.documentJobs,
        subs: mockStats.subtitleJobs,
      }),
    },
    {
      title: t("processing"),
      value: mockStats.processingJobs.toString(),
      change: mockStats.processingChange,
      trend: mockStats.processingTrend,
      trendLabel: t("vsYesterday"),
      icon: Clock,
      iconColor: "text-accent",
      iconBg: "bg-accent/10",
    },
    {
      title: t("completedThisMonth"),
      value: mockStats.completedThisMonth.toString(),
      change: mockStats.completedChange,
      trend: mockStats.completedTrend,
      trendLabel: t("vsLastMonth"),
      icon: CheckCircle,
      iconColor: "text-success",
      iconBg: "bg-success/10",
      subtitle: t("successRate", { rate: mockStats.successRate }),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-border shadow-sm py-2">
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
  );
}
