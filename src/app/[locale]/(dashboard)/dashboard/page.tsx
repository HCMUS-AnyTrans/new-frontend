import { setRequestLocale } from "next-intl/server";
import {
  StatsCards,
  QuickActions,
  JobsChart,
  CreditUsageChart,
  DashboardGreeting,
  StorageUsage,
} from "@/features/dashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-[1600px]">
      {/* Welcome + Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
        <DashboardGreeting />
        <div className="shrink-0">
          <QuickActions />
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="w-full">
        <StatsCards />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {/* Main Chart */}
        <div className="lg:col-span-2 xl:col-span-3">
          <JobsChart />
        </div>

        {/* Right Sidebar (Usage & Storage) */}
        <div className="flex flex-col gap-6 lg:col-span-1 xl:col-span-1">
          <CreditUsageChart />
          <StorageUsage />
        </div>
      </div>
    </div>
  );
}
