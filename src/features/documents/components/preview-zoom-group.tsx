'use client';

import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { PreviewZoomMode } from '../hooks/use-document-preview-controller';

interface PreviewZoomGroupProps {
  zoomMode: PreviewZoomMode;
  zoomScale: number;
  zoomIndicator: string;
  onZoomModeChange: (mode: PreviewZoomMode) => void;
  onZoomScaleChange: (scale: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function PreviewZoomGroup({
  zoomMode,
  zoomScale,
  zoomIndicator,
  onZoomModeChange,
  onZoomScaleChange,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: PreviewZoomGroupProps) {
  const t = useTranslations('documents.preview');

  function handleResetZoom() {
    onZoomModeChange('custom');
    onZoomScaleChange(1);
    onZoomReset();
  }

  return (
    <div
      role="group"
      aria-label={t('zoomControlsLabel')}
      className="inline-flex h-9 min-w-[360px] shrink-0 items-center gap-1 rounded-lg border border-border/60 bg-muted/20 p-1"
    >
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        aria-label={t('zoomOut')}
        title={t('zoomOut')}
        onClick={onZoomOut}
      >
        <Minus className="size-3" />
      </Button>
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        aria-label={t('zoomIn')}
        title={t('zoomIn')}
        onClick={onZoomIn}
      >
        <Plus className="size-3" />
      </Button>
      <Button
        type="button"
        size="xs"
        variant={zoomMode === 'custom' && zoomScale === 1 ? 'secondary' : 'ghost'}
        className="h-7 min-w-[52px] px-2"
        aria-label={t('resetZoomAriaLabel')}
        title={t('resetZoomAriaLabel')}
        onClick={handleResetZoom}
      >
        {t('resetZoom')}
      </Button>
      <Button
        type="button"
        size="xs"
        variant={zoomMode === 'fit-page' ? 'secondary' : 'ghost'}
        className="h-7 min-w-[74px] px-2"
        aria-pressed={zoomMode === 'fit-page'}
        onClick={() => onZoomModeChange('fit-page')}
      >
        {t('fitPage')}
      </Button>
      <Button
        type="button"
        size="xs"
        variant={zoomMode === 'fit-width' ? 'secondary' : 'ghost'}
        className="h-7 min-w-[78px] px-2"
        aria-pressed={zoomMode === 'fit-width'}
        onClick={() => onZoomModeChange('fit-width')}
      >
        {t('fitWidth')}
      </Button>
      <span className="inline-flex h-7 min-w-[64px] items-center justify-center rounded-md border border-border/50 bg-background px-2 text-xs font-medium text-muted-foreground">
        {zoomIndicator}
      </span>
    </div>
  );
}
