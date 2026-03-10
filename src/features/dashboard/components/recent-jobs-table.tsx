"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { useRecentJobs } from "../hooks";
import {
  DashboardCard,
  DashboardCardContent,
  DashboardCardHeader,
} from "./dashboard-card";
import { HistoryTable, HistoryJobDetail } from "@/features/history";
import type { TranslationJobResponse } from "../api/dashboard.api";

function RecentJobsTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 lg:px-6">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="hidden h-11 px-4 sm:table-cell lg:px-6">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="h-11 px-4 lg:px-6">
              <Skeleton className="h-4 w-14" />
            </TableHead>
            <TableHead className="hidden h-11 px-4 sm:table-cell lg:px-6">
              <Skeleton className="ml-auto h-4 w-14" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="px-4 py-3.5 lg:px-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 shrink-0 rounded" />
                  <Skeleton className="h-4 w-32 sm:w-44" />
                </div>
              </TableCell>
              <TableCell className="hidden px-4 py-3.5 sm:table-cell lg:px-6">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="size-3 rounded-full" />
                  <Skeleton className="h-4 w-6" />
                </div>
              </TableCell>
              <TableCell className="px-4 py-3.5 lg:px-6">
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell className="hidden px-4 py-3.5 sm:table-cell lg:px-6">
                <div className="flex items-center justify-end gap-1">
                  <Skeleton className="size-3.5 rounded" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function RecentJobsTable() {
  const t = useTranslations("dashboard.recentJobs");
  const locale = useLocale();
  const { jobsData, isLoading, isError } = useRecentJobs({
    limit: 5,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [selectedJob, setSelectedJob] = useState<TranslationJobResponse | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetails = useCallback((job: TranslationJobResponse) => {
    setSelectedJob(job);
    setDetailOpen(true);
  }, []);

  const jobs = jobsData?.data ?? [];
  const isEmpty = jobs.length === 0;

  return (
    <>
      <DashboardCard className="overflow-hidden">
        <DashboardCardHeader className="flex flex-row items-center justify-between gap-4 px-4 pb-4 sm:px-6">
          <CardTitle className="text-base font-semibold text-foreground">
            {t("title")}
          </CardTitle>
          <Link
            href="/history"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("viewAll")}
          </Link>
        </DashboardCardHeader>
        <DashboardCardContent padding="none" className="px-0 pb-6">
          {isLoading ? (
            <div className="px-4 sm:px-6">
              <RecentJobsTableSkeleton />
            </div>
          ) : isError || isEmpty ? (
            <div className="flex items-center justify-center px-4 py-12 sm:px-6">
              <p className="text-sm text-muted-foreground">{t("noJobs")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <HistoryTable
                jobs={jobs}
                locale={locale}
                onViewDetails={handleViewDetails}
                compact
                hideActions
              />
            </div>
          )}
        </DashboardCardContent>
      </DashboardCard>

      <HistoryJobDetail
        job={selectedJob}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        locale={locale}
      />
    </>
  );
}
