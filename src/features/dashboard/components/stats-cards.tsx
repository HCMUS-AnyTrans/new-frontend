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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => {
        return (
          <DashboardCard key={i}>
            <DashboardCardContent padding="all" className="flex flex-col gap-2 p-3 sm:gap-3 sm:p-4 md:gap-4 md:p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-9 rounded-xl sm:h-12 sm:w-12" />
                <Skeleton className="h-5 w-12 rounded-full sm:h-6 sm:w-16" />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Skeleton className="h-3 w-20 sm:h-4 sm:w-28" />
                <Skeleton className="h-7 w-16 sm:h-9 sm:w-24" />
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
      iconSrc: "/stats-card-icon/dollar.png",
      iconAlt: "Total credits",
      iconBg: "bg-secondary/10",
    },
    {
      title: t("totalJobs"),
      value: stats.totalJobs.toString(),
      change: stats.jobsChange,
      trend: stats.jobsTrend,
      iconSrc: "/stats-card-icon/google-docs.png",
      iconAlt: "Total jobs",
      iconBg: "bg-primary/10",
    },
    {
      title: t("processing"),
      value: stats.processingJobs.toString(),
      change: stats.processingChange,
      trend: stats.processingTrend,
      iconSrc: "/stats-card-icon/alarm-clock.png",
      iconAlt: "Processing jobs",
      iconBg: "bg-accent/10",
    },
    {
      title: t("completedThisMonth"),
      value: stats.completedThisMonth.toString(),
      change: stats.completedChange,
      trend: stats.completedTrend,
      iconSrc: "/stats-card-icon/check.png",
      iconAlt: "Completed jobs",
      iconBg: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
      {statCards.map((stat) => (
        <DashboardCard key={stat.title} interactive>
          <DashboardCardContent padding="all" className="flex flex-col gap-2 p-3 sm:gap-3 sm:p-4 md:gap-4 md:p-6">
            <div className="flex items-start justify-between">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl ${stat.iconBg}`}
              >
                <Image
                  src={stat.iconSrc}
                  alt={stat.iconAlt}
                  width={24}
                  height={24}
                  className="h-4 w-4 object-contain sm:h-6 sm:w-6"
                />
              </div>

              <div className="flex items-center gap-0.5 rounded-full border border-border px-1.5 py-0.5 sm:gap-1 sm:px-2 sm:py-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="size-3 text-success sm:size-3.5" />
                ) : stat.trend === "down" ? (
                  <TrendingDown className="size-3 text-accent sm:size-3.5" />
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
              <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                {stat.title}
              </p>
              <p className="mt-0.5 text-xl font-bold tracking-tight text-foreground tabular-nums sm:mt-1 sm:text-2xl md:text-3xl">
                {stat.value}
              </p>
            </div>
          </DashboardCardContent>
        </DashboardCard>
      ))}
    </div>
  );
}
