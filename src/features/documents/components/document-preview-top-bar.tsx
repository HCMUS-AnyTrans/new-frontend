'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface DocumentPreviewTopBarProps {
  displayMode: 'paged' | 'continuous';
  onBack: () => void;
  onDisplayModeChange: (mode: 'paged' | 'continuous') => void;
}

export function DocumentPreviewTopBar({
  displayMode,
  onBack,
  onDisplayModeChange,
}: DocumentPreviewTopBarProps) {
  const t = useTranslations('documents.preview');
  const tCommon = useTranslations('common');

  return (
    <div className="flex items-center justify-between gap-3 py-2 md:py-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-2 gap-1 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {tCommon('back')}
      </Button>

      <div
        className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/20 p-1"
        aria-label={t('displayModeLabel')}
      >
        <Button
          type="button"
          size="sm"
          variant={displayMode === 'paged' ? 'secondary' : 'ghost'}
          className="h-8 px-3"
          onClick={() => onDisplayModeChange('paged')}
          aria-pressed={displayMode === 'paged'}
        >
          {t('pagedMode')}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={displayMode === 'continuous' ? 'secondary' : 'ghost'}
          className="h-8 px-3"
          onClick={() => onDisplayModeChange('continuous')}
          aria-pressed={displayMode === 'continuous'}
        >
          {t('continuousMode')}
        </Button>
      </div>
    </div>
  );
}
