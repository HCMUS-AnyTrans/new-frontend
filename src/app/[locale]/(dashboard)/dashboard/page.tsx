import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import {
  StatsCards,
  QuickActions,
  JobsChart,
  CreditUsageChart,
  RecentJobsTable,
  ActivityFeed,
  StorageUsage,
} from "@/features/dashboard";
import { mockUser } from "@/features/dashboard/data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard.welcome");

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Welcome + Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t("greeting", { name: mockUser.fullName })}
          </h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <QuickActions />
      </div>

      {/* KPI Stats Cards */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <JobsChart />
        </div>
        <div className="lg:col-span-2">
          <CreditUsageChart />
        </div>
      </div>

      {/* Recent Jobs Table */}
      <RecentJobsTable />

      {/* Activity Feed + Storage */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ActivityFeed />
        </div>
        <div className="lg:col-span-2">
          <StorageUsage />
        </div>
      </div>
    </div>
  );
}
