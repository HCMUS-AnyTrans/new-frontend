'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { History } from 'lucide-react';
import { useHistoryJobs } from '../hooks';
import { HistoryFilters } from './history-filters';
import { HistoryTable } from './history-table';
import { HistoryPagination } from './history-pagination';
import { HistoryEmptyState } from './history-empty-state';
import { HistoryTableSkeleton } from './history-table-skeleton';

/**
 * Top-level orchestrator for the history page.
 * Wires the useHistoryJobs hook to all presentational sub-components.
 */
export function HistoryContent() {
  const t = useTranslations('dashboard.history');
  const locale = useLocale();

  const {
    jobs,
    meta,
    isLoading,
    isError,
    search,
    statusFilter,
    hasFilters,
    handleSearchChange,
    handleStatusChange,
    setPage,
  } = useHistoryJobs();

  if (isLoading || isError) {
    return <HistoryTableSkeleton />;
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="size-5 text-primary" />
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <HistoryFilters
          search={search}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
        />

        {jobs.length === 0 ? (
          <HistoryEmptyState hasFilters={hasFilters} />
        ) : (
          <>
            <HistoryTable jobs={jobs} locale={locale} />
            {meta && (
              <HistoryPagination meta={meta} onPageChange={setPage} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
