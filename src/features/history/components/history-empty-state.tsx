import { useTranslations } from 'next-intl';
import { FileQuestion } from 'lucide-react';
import type { HistoryEmptyStateProps } from '../types';

export function HistoryEmptyState({ hasFilters }: HistoryEmptyStateProps) {
  const t = useTranslations('dashboard.history');

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileQuestion className="size-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-base font-medium text-foreground mb-1">
        {hasFilters ? t('noResults') : t('noJobs')}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {hasFilters ? t('noResultsDescription') : t('noJobsDescription')}
      </p>
    </div>
  );
}
