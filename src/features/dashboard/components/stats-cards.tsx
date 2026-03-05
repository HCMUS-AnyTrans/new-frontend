"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardCard,
  DashboardCardContent,
} from "./dashboard-card";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useDashboardStats } from "../hooks";

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => {
        return (
          <DashboardCard key={i}>
            <DashboardCardContent padding="all" className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-24" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </DashboardCardContent>
          </DashboardCard>
        );
      })}
    </div>
  );
}

export function StatsCards() {
  const t = useTranslations("dashboard.stats");
  const locale = useLocale();
  const { stats, isLoading, isError } = useDashboardStats();

  if (isLoading) return <StatsCardsSkeleton />;
  if (isError || !stats) return <StatsCardsSkeleton />;

  const statCards = [
    {
      title: t("totalCredits"),
      value: stats.totalCredits.toLocaleString(
        locale === "vi" ? "vi-VN" : "en-US"
      ),
      change: stats.creditsChange,
      trend: stats.creditsTrend,
      trendLabel: t("vsLastMonth"),
      iconSrc: "/stats-card-icon/dollar.png",
      iconAlt: "Total credits",
      iconBg: "bg-secondary/10",
      footer: t("vsLastMonth"),
    },
    {
      title: t("totalJobs"),
      value: stats.totalJobs.toString(),
      change: stats.jobsChange,
      trend: stats.jobsTrend,
      trendLabel: t("vsLastMonth"),
      iconSrc: "/stats-card-icon/google-docs.png",
      iconAlt: "Total jobs",
      iconBg: "bg-primary/10",
      subtitle: t("documentsCount", {
        docs: stats.documentJobs,
      }),
      footer: t("documentsCount", {
        docs: stats.documentJobs,
      }),
    },
    {
      title: t("processing"),
      value: stats.processingJobs.toString(),
      change: stats.processingChange,
      trend: stats.processingTrend,
      trendLabel: t("vsYesterday"),
      iconSrc: "/stats-card-icon/alarm-clock.png",
      iconAlt: "Processing jobs",
      iconBg: "bg-accent/10",
      footer: t("vsYesterday"),
    },
    {
      title: t("completedThisMonth"),
      value: stats.completedThisMonth.toString(),
      change: stats.completedChange,
      trend: stats.completedTrend,
      trendLabel: t("vsLastMonth"),
      iconSrc: "/stats-card-icon/check.png",
      iconAlt: "Completed jobs",
      iconBg: "bg-success/10",
      subtitle: t("successRate", { rate: stats.successRate }),
      footer: t("successRate", { rate: stats.successRate }),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <DashboardCard key={stat.title} interactive>
          <DashboardCardContent padding="all" className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <Image
                  src={stat.iconSrc}
                  alt={stat.iconAlt}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </div>

              <div className="flex items-center gap-1 rounded-full border border-border px-2 py-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="size-3.5 text-success" />
                ) : stat.trend === "down" ? (
                  <TrendingDown className="size-3.5 text-accent" />
                ) : null}
                <span
                  className={`text-xs font-semibold ${
                    stat.trend === "up"
                      ? "text-success"
                      : stat.trend === "down"
                        ? "text-accent"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-foreground tabular-nums">
                {stat.value}
              </p>
            </div>

            <div className="text-sm font-medium text-muted-foreground">
              <p className="truncate">{stat.footer ?? stat.trendLabel}</p>
              {stat.subtitle && stat.subtitle !== stat.footer && (
                <p className="mt-1 truncate text-xs">{stat.subtitle}</p>
              )}
            </div>
          </DashboardCardContent>
        </DashboardCard>
      ))}
    </div>
  );
}
