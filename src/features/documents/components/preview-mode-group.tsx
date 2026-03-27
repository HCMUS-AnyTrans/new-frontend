'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { DocumentPreviewDisplayMode } from '../hooks/use-document-preview-controller';

interface PreviewModeGroupProps {
  displayMode: DocumentPreviewDisplayMode;
  onDisplayModeChange: (mode: DocumentPreviewDisplayMode) => void;
}

export function PreviewModeGroup({
  displayMode,
  onDisplayModeChange,
}: PreviewModeGroupProps) {
  const t = useTranslations('documents.preview');

  return (
    <div
      role="group"
      aria-label={t('displayModeLabel')}
      className="inline-flex h-9 min-w-[170px] shrink-0 items-center gap-1 rounded-lg border border-border/60 bg-muted/20 p-1"
    >
      <Button
        type="button"
        size="xs"
        variant={displayMode === 'paged' ? 'secondary' : 'ghost'}
        className="h-7 min-w-0 flex-1 px-2.5 sm:px-3"
        onClick={() => onDisplayModeChange('paged')}
        aria-pressed={displayMode === 'paged'}
      >
        {t('pagedMode')}
      </Button>
      <Button
        type="button"
        size="xs"
        variant={displayMode === 'continuous' ? 'secondary' : 'ghost'}
        className="h-7 min-w-0 flex-1 px-2.5 sm:px-3"
        onClick={() => onDisplayModeChange('continuous')}
        aria-pressed={displayMode === 'continuous'}
      >
        {t('continuousMode')}
      </Button>
    </div>
  );
}
