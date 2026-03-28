'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PreviewPageNavigationGroupProps {
  currentPage: number;
  totalPages: number | null;
  jumpToPageInput: string;
  canJumpToPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onJumpToPageInputChange: (value: string) => void;
  onJumpToPageCommit: () => void;
}

export function PreviewPageNavigationGroup({
  currentPage,
  totalPages,
  jumpToPageInput,
  canJumpToPage,
  onPreviousPage,
  onNextPage,
  onJumpToPageInputChange,
  onJumpToPageCommit,
}: PreviewPageNavigationGroupProps) {
  const t = useTranslations('documents.preview');

  return (
    <div className="inline-flex h-9 min-w-[280px] shrink-0 items-center gap-1 rounded-lg border border-dashed border-border/60 bg-muted/10 p-1">
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        aria-label={t('previousPage')}
        onClick={onPreviousPage}
        disabled={!canJumpToPage || currentPage <= 1}
      >
        <ChevronLeft className="size-3" />
      </Button>
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        aria-label={t('nextPage')}
        onClick={onNextPage}
        disabled={
          !canJumpToPage || (totalPages !== null && currentPage >= totalPages)
        }
      >
        <ChevronRight className="size-3" />
      </Button>
      <span className="px-1 text-xs font-medium text-muted-foreground">
        {t('page')}
      </span>
      <Input
        value={jumpToPageInput}
        onChange={(event) => onJumpToPageInputChange(event.target.value)}
        onBlur={onJumpToPageCommit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onJumpToPageCommit();
          }
        }}
        inputMode="numeric"
        pattern="[0-9]*"
        disabled={!canJumpToPage}
        aria-label={t('pageInputLabel')}
        className="h-7 w-16 bg-background text-xs sm:w-20"
      />
      <span className="inline-flex min-w-[84px] items-center justify-center px-1 text-xs font-medium text-muted-foreground">
        {t('pageStatus', { current: currentPage, total: totalPages ?? '-' })}
      </span>
    </div>
  );
}
