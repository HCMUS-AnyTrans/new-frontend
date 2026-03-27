'use client';

import { ArrowLeft, FileWarning, Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DocumentPreviewTopBar } from './document-preview-top-bar';
import { PdfPreviewPane } from './pdf-preview-pane';
import {
  useDocumentPreviewController,
  useTranslationJob,
  type DocumentPreviewPaneId,
} from '../hooks';
import { canPreviewTranslationJob } from '../utils/preview-capabilities';

function PreviewState({
  title,
  description,
  backLabel,
  onBack,
}: {
  title: string;
  description: string;
  backLabel: string;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-var(--dashboard-header-height)-4rem)] items-center justify-center">
      <Alert className="max-w-xl border-border/70 bg-background/90 shadow-sm">
        <FileWarning className="size-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>{description}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="-ml-2 gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

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
    setZoomScale,
    incrementZoom,
    decrementZoom,
    resetZoom,
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

  const sharedCurrentPage =
    displayMode === 'continuous' ? currentVisiblePage : currentPage;
  const sharedPageValue =
    displayMode === 'continuous' ? jumpToPageInput : pageInputValue;
  const handleSharedPageInputChange =
    displayMode === 'continuous'
      ? handleJumpToPageInputChange
      : handlePageInputChange;
  const handleSharedPageCommit =
    displayMode === 'continuous'
      ? handleJumpToPageCommit
      : handlePageInputCommit;
  const handleSharedPreviousPage =
    displayMode === 'continuous' ? goToPreviousPage : handlePreviousPage;
  const handleSharedNextPage =
    displayMode === 'continuous' ? goToNextPage : handleNextPage;

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

  if (!jobId) {
    return (
      <PreviewState
        title={t('missingJobTitle')}
        description={t('missingJobDescription')}
        backLabel={tCommon('back')}
        onBack={handleBack}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-var(--dashboard-header-height)-4rem)] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {t('loadingJob')}
      </div>
    );
  }

  if (isError || !job) {
    return (
      <PreviewState
        title={t('loadErrorTitle')}
        description={t('loadErrorDescription')}
        backLabel={tCommon('back')}
        onBack={handleBack}
      />
    );
  }

  if (job.status !== 'succeeded' || !job.input_file || !job.output_file) {
    return (
      <PreviewState
        title={t('notReadyTitle')}
        description={t('notReadyDescription')}
        backLabel={tCommon('back')}
        onBack={handleBack}
      />
    );
  }

  if (
    !canPreviewTranslationJob({
      inputFile: job.input_file,
      outputFile: job.output_file,
    })
  ) {
    return (
      <PreviewState
        title={t('unsupportedTitle')}
        description={t('unsupportedDescription')}
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
        zoomScale={zoomScale}
        currentPage={sharedCurrentPage}
        totalPages={maxAvailablePage}
        jumpToPageInput={sharedPageValue}
        canJumpToPage={canNavigate}
        onBack={handleBack}
        onDisplayModeChange={setDisplayMode}
        onZoomModeChange={setZoomMode}
        onZoomScaleChange={setZoomScale}
        onZoomIn={incrementZoom}
        onZoomOut={decrementZoom}
        onZoomReset={resetZoom}
        onJumpToPageInputChange={handleSharedPageInputChange}
        onJumpToPageCommit={handleSharedPageCommit}
        onPreviousPage={handleSharedPreviousPage}
        onNextPage={handleSharedNextPage}
      />

      <div className="flex min-h-0 flex-1 pb-1 lg:pb-2">
        <div className="grid min-h-0 w-full grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
          <PdfPreviewPane
            paneId="input"
            fileId={job.input_file.id}
            fileName={job.input_file.name}
            title={t('original')}
            loadingLabel={t('loadingOriginal')}
            errorLabel={t('renderError')}
            currentPage={currentPage}
            displayMode={displayMode}
            zoomMode={zoomMode}
            zoomScale={zoomScale}
            currentVisiblePage={currentVisiblePage}
            continuousJumpCommand={continuousJumpCommand}
            isVisiblePageAuthority={continuousInteractionPane === 'input'}
            continuousScrollRatio={continuousScrollRatio}
            onContinuousInteractionStart={handleContinuousInteractionStart}
            onNumPagesChange={handleInputNumPagesChange}
            onContinuousScrollRatioChange={handleContinuousScrollRatioChange}
            onCurrentVisiblePageChange={setCurrentVisiblePage}
          />

          <PdfPreviewPane
            paneId="output"
            fileId={job.output_file.id}
            fileName={job.output_file.name}
            title={t('translated')}
            loadingLabel={t('loadingTranslated')}
            errorLabel={t('renderError')}
            currentPage={currentPage}
            displayMode={displayMode}
            zoomMode={zoomMode}
            zoomScale={zoomScale}
            currentVisiblePage={currentVisiblePage}
            continuousJumpCommand={continuousJumpCommand}
            isVisiblePageAuthority={continuousInteractionPane === 'output'}
            continuousScrollRatio={continuousScrollRatio}
            onContinuousInteractionStart={handleContinuousInteractionStart}
            onNumPagesChange={handleOutputNumPagesChange}
            onContinuousScrollRatioChange={handleContinuousScrollRatioChange}
            onCurrentVisiblePageChange={setCurrentVisiblePage}
          />
        </div>
      </div>
    </div>
  );
}
