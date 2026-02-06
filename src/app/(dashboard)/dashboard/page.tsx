import {
  StatsCards,
  QuickActions,
  JobsChart,
  CreditUsageChart,
  RecentJobsTable,
  ActivityFeed,
  StorageUsage,
} from "@/components/dashboard"
import { mockUser } from "@/data/dashboard"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Welcome + Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Xin chào, {mockUser.fullName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Tổng quan hoạt động dịch thuật của bạn hôm nay.
          </p>
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
  )
}
