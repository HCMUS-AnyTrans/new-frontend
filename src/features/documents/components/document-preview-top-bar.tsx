'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type {
  DocumentPreviewDisplayMode,
  PreviewZoomMode,
} from '../hooks/use-document-preview-controller';
import { PreviewModeGroup } from './preview-mode-group';
import { PreviewZoomGroup } from './preview-zoom-group';
import { PreviewPageNavigationGroup } from './preview-page-navigation-group';

interface DocumentPreviewTopBarProps {
  displayMode: DocumentPreviewDisplayMode;
  zoomMode: PreviewZoomMode;
  zoomPercent: number;
  currentPage: number;
  totalPages: number | null;
  jumpToPageInput: string;
  canJumpToPage: boolean;
  onBack: () => void;
  onDisplayModeChange: (mode: DocumentPreviewDisplayMode) => void;
  onZoomModeChange: (mode: PreviewZoomMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onJumpToPageInputChange: (value: string) => void;
  onJumpToPageCommit: () => void;
}

export function DocumentPreviewTopBar(props: DocumentPreviewTopBarProps) {
  const tCommon = useTranslations('common');
  const {
    displayMode,
    zoomMode,
    zoomPercent,
    currentPage,
    totalPages,
    jumpToPageInput,
    canJumpToPage,
    onBack,
    onDisplayModeChange,
    onZoomModeChange,
    onZoomIn,
    onZoomOut,
    onPreviousPage,
    onNextPage,
    onJumpToPageInputChange,
    onJumpToPageCommit,
  } = props;

  const zoomIndicator = `${zoomPercent}%`;

  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-border/60 bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:-mx-6 md:px-6 xl:-mx-8 xl:px-8">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 shrink-0 gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {tCommon('back')}
        </Button>

        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="ml-auto flex w-max min-w-full items-center justify-end gap-2 whitespace-nowrap">
            <PreviewModeGroup
              displayMode={displayMode}
              onDisplayModeChange={onDisplayModeChange}
            />

            <PreviewZoomGroup
              zoomMode={zoomMode}
              zoomIndicator={zoomIndicator}
              onZoomModeChange={onZoomModeChange}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
            />

            <PreviewPageNavigationGroup
              currentPage={currentPage}
              totalPages={totalPages}
              jumpToPageInput={jumpToPageInput}
              canJumpToPage={canJumpToPage}
              onPreviousPage={onPreviousPage}
              onNextPage={onNextPage}
              onJumpToPageInputChange={onJumpToPageInputChange}
              onJumpToPageCommit={onJumpToPageCommit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
