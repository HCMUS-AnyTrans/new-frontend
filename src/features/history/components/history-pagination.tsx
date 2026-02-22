import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HistoryPaginationProps } from '../types';

export function HistoryPagination({
  meta,
  onPageChange,
}: HistoryPaginationProps) {
  const t = useTranslations('dashboard.history');

  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t">
      <p className="text-sm text-muted-foreground">
        {t('totalJobs', { count: meta.total })}
        {' \u2022 '}
        {t('pageInfo', { page: meta.page, totalPages: meta.totalPages })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasPrev}
          onClick={() => onPageChange(Math.max(1, meta.page - 1))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasNext}
          onClick={() => onPageChange(meta.page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
