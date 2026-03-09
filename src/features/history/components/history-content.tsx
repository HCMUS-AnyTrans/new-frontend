'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { AppCard, AppCardContent } from '@/components/ui/app-card';
import { useHistoryJobs } from '../hooks';
import { HistoryFilters } from './history-filters';
import { HistoryTable } from './history-table';
import { HistoryPagination } from './history-pagination';
import { HistoryEmptyState } from './history-empty-state';
import { HistoryTableSkeleton } from './history-table-skeleton';
import { HistoryJobDetail } from './history-job-detail';
import type { TranslationJobResponse } from '@/features/dashboard/api/dashboard.api';

/**
 * Top-level orchestrator for the history page.
 * Wires the useHistoryJobs hook to all presentational sub-components.
 */
export function HistoryContent() {
  const locale = useLocale();
  const [selectedJob, setSelectedJob] = useState<TranslationJobResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetails = useCallback((job: TranslationJobResponse) => {
    setSelectedJob(job);
    setDetailOpen(true);
  }, []);

  const {
    jobs,
    meta,
    isLoading,
    isError,
    search,
    statusFilter,
    domainFilter,
    hasFilters,
    handleSearchChange,
    handleStatusChange,
    handleDomainChange,
    setPage,
  } = useHistoryJobs();

  return (
    <>
      <HistoryFilters
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        domainFilter={domainFilter}
        onDomainChange={handleDomainChange}
      />

      {isLoading && jobs.length === 0 ? (
        <HistoryTableSkeleton showFilters={false} />
      ) : (isError || jobs.length === 0) ? (
        <AppCard>
          <HistoryEmptyState hasFilters={hasFilters} />
        </AppCard>
      ) : (
        <AppCard className="overflow-hidden">
          <HistoryTable jobs={jobs} locale={locale} onViewDetails={handleViewDetails} />
          {meta && meta.totalPages > 1 && (
            <AppCardContent padding="none" className="border-t px-4 py-3 lg:px-6">
              <HistoryPagination meta={meta} onPageChange={setPage} />
            </AppCardContent>
          )}
        </AppCard>
      )}

      <HistoryJobDetail
        job={selectedJob}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        locale={locale}
      />
    </>
  );
}
