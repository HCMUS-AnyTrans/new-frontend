'use client';

import { Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { DocumentPreviewState } from './document-preview-state';
import { DocumentPreviewTopBar } from './document-preview-top-bar';
import { PdfPreviewPane } from './pdf-preview-pane';
import {
  useDocumentPreviewController,
  useDocumentPreviewGateState,
  useDocumentPreviewScreenZoom,
  useTranslationJob,
  type DocumentPreviewPaneId,
} from '../hooks';

export function DocumentPreviewScreen() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('documents.preview');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const [continuousScrollRatio, setContinuousScrollRatio] = useState(0);
  const [continuousInteractionPane, setContinuousInteractionPane] =
    useState<DocumentPreviewPaneId>('input');

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(`/${locale}/documents`);
  }, [locale, router]);

  const {
    data: job,
    isLoading,
    isError,
  } = useTranslationJob(jobId, {
    enabled: !!jobId,
    pollInterval: false,
  });

  const inputFileId = job?.input_file?.id ?? null;
  const outputFileId = job?.output_file?.id ?? null;
  const previewState = useDocumentPreviewController({
    jobId,
    inputFileId,
    outputFileId,
  });
  const {
    currentPage,
    currentVisiblePage,
    pageInputValue,
    jumpToPageInput,
    continuousJumpCommand,
    maxAvailablePage,
    canNavigate,
    displayMode,
    zoomMode,
    zoomScale,
    setDisplayMode,
    setZoomMode,
    incrementZoom,
    decrementZoom,
    incrementZoomFromScale,
    decrementZoomFromScale,
    setCurrentVisiblePage,
    handlePageInputChange,
    handlePageInputCommit,
    handleJumpToPageInputChange,
    handleJumpToPageCommit,
    handlePreviousPage,
    handleNextPage,
    goToPreviousPage,
    goToNextPage,
    handleInputNumPagesChange,
    handleOutputNumPagesChange,
  } = previewState;

  const sharedNavigationProps = {
    currentPage: displayMode === 'continuous' ? currentVisiblePage : currentPage,
    jumpToPageInput: displayMode === 'continuous' ? jumpToPageInput : pageInputValue,
    onJumpToPageInputChange:
      displayMode === 'continuous' ? handleJumpToPageInputChange : handlePageInputChange,
    onJumpToPageCommit:
      displayMode === 'continuous' ? handleJumpToPageCommit : handlePageInputCommit,
    onPreviousPage: displayMode === 'continuous' ? goToPreviousPage : handlePreviousPage,
    onNextPage: displayMode === 'continuous' ? goToNextPage : handleNextPage,
  };

  const handleContinuousScrollRatioChange = useCallback((nextRatio: number) => {
    setContinuousScrollRatio((currentRatio) => {
      if (Math.abs(currentRatio - nextRatio) < 0.001) {
        return currentRatio;
      }

      return nextRatio;
    });
  }, []);

  const handleContinuousInteractionStart = useCallback(
    (pane: DocumentPreviewPaneId) => {
      setContinuousInteractionPane((currentPane) =>
        currentPane === pane ? currentPane : pane,
      );
    },
    [],
  );

  const {
    resolvedZoomPercent,
    handleZoomPercentageChange,
    handleZoomIn,
    handleZoomOut,
  } = useDocumentPreviewScreenZoom({
    displayMode,
    zoomMode,
    zoomScale,
    continuousInteractionPane,
    incrementZoom,
    decrementZoom,
    incrementZoomFromScale,
    decrementZoomFromScale,
  });

  const previewGateState = useDocumentPreviewGateState({
    jobId,
    job,
    isLoading,
    isError,
    t,
  });

  const previewPanes = useMemo(() => {
    if (!job?.input_file || !job.output_file) {
      return [];
    }

    return [
      {
        paneId: 'input' as const,
        fileId: job.input_file.id,
        fileName: job.input_file.name,
        title: t('original'),
        loadingLabel: t('loadingOriginal'),
        isVisiblePageAuthority: continuousInteractionPane === 'input',
        onNumPagesChange: handleInputNumPagesChange,
      },
      {
        paneId: 'output' as const,
        fileId: job.output_file.id,
        fileName: job.output_file.name,
        title: t('translated'),
        loadingLabel: t('loadingTranslated'),
        isVisiblePageAuthority: continuousInteractionPane === 'output',
        onNumPagesChange: handleOutputNumPagesChange,
      },
    ];
  }, [
    continuousInteractionPane,
    handleInputNumPagesChange,
    handleOutputNumPagesChange,
    job?.input_file,
    job?.output_file,
    t,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-var(--dashboard-header-height)-4rem)] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {t('loadingJob')}
      </div>
    );
  }

  if (previewGateState) {
    return (
      <DocumentPreviewState
        title={previewGateState.title}
        description={previewGateState.description}
        backLabel={tCommon('back')}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="gap-1 -mx-4 flex h-[calc(100vh-var(--dashboard-header-height))] flex-col overflow-hidden px-4 md:-mx-[var(--dashboard-content-margin)] md:px-6 xl:px-8">
      <DocumentPreviewTopBar
        displayMode={displayMode}
        zoomMode={zoomMode}
        zoomPercent={resolvedZoomPercent}
        currentPage={sharedNavigationProps.currentPage}
        totalPages={maxAvailablePage}
        jumpToPageInput={sharedNavigationProps.jumpToPageInput}
        canJumpToPage={canNavigate}
        onBack={handleBack}
        onDisplayModeChange={setDisplayMode}
        onZoomModeChange={setZoomMode}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onJumpToPageInputChange={sharedNavigationProps.onJumpToPageInputChange}
        onJumpToPageCommit={sharedNavigationProps.onJumpToPageCommit}
        onPreviousPage={sharedNavigationProps.onPreviousPage}
        onNextPage={sharedNavigationProps.onNextPage}
      />

      <div className="flex min-h-0 flex-1 pb-1 lg:pb-2">
        <div className="grid min-h-0 w-full grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
          {previewPanes.map((pane) => (
            <PdfPreviewPane
              key={pane.paneId}
              paneId={pane.paneId}
              fileId={pane.fileId}
              fileName={pane.fileName}
              title={pane.title}
              loadingLabel={pane.loadingLabel}
              errorLabel={t('renderError')}
              currentPage={currentPage}
              displayMode={displayMode}
              zoomMode={zoomMode}
              zoomScale={zoomScale}
              currentVisiblePage={currentVisiblePage}
              continuousJumpCommand={continuousJumpCommand}
              isVisiblePageAuthority={pane.isVisiblePageAuthority}
              continuousScrollRatio={continuousScrollRatio}
              onContinuousInteractionStart={handleContinuousInteractionStart}
              onNumPagesChange={pane.onNumPagesChange}
              onContinuousScrollRatioChange={handleContinuousScrollRatioChange}
              onCurrentVisiblePageChange={setCurrentVisiblePage}
              onZoomPercentageChange={handleZoomPercentageChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
