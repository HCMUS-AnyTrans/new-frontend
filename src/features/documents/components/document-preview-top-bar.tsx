'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { DocumentPreviewDisplayMode } from '../hooks/use-document-preview-state';

interface DocumentPreviewTopBarProps {
  displayMode: DocumentPreviewDisplayMode;
  onBack: () => void;
  onDisplayModeChange: (mode: DocumentPreviewDisplayMode) => void;
}

export function DocumentPreviewTopBar({
  displayMode,
  onBack,
  onDisplayModeChange,
}: DocumentPreviewTopBarProps) {
  const t = useTranslations('documents.preview');
  const tCommon = useTranslations('common');

  return (
    <div className="flex flex-wrap items-center gap-2 py-2 md:py-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-2 shrink-0 gap-1 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {tCommon('back')}
      </Button>

      <div
        role="group"
        aria-label={t('displayModeLabel')}
        className="ml-auto inline-flex max-w-full flex-wrap items-center justify-end gap-1 rounded-lg border border-border/60 bg-muted/20 p-1 sm:flex-nowrap"
      >
        <Button
          type="button"
          size="xs"
          variant={displayMode === 'paged' ? 'secondary' : 'ghost'}
          className="h-7 min-w-0 flex-1 px-2.5 sm:flex-none sm:px-3"
          onClick={() => onDisplayModeChange('paged')}
          aria-pressed={displayMode === 'paged'}
        >
          {t('pagedMode')}
        </Button>
        <Button
          type="button"
          size="xs"
          variant={displayMode === 'continuous' ? 'secondary' : 'ghost'}
          className="h-7 min-w-0 flex-1 px-2.5 sm:flex-none sm:px-3"
          onClick={() => onDisplayModeChange('continuous')}
          aria-pressed={displayMode === 'continuous'}
        >
          {t('continuousMode')}
        </Button>
      </div>
    </div>
  );
}
