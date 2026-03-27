'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileTypeIcon } from '@/components/shared/file-type-icon';
import { getFileDownloadUrl } from '../api/documents.api';
import { PreviewPaneShell } from './preview-pane-shell';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfPreviewPaneProps {
  fileId: string;
  fileName: string;
  title: string;
  loadingLabel: string;
  errorLabel: string;
  currentPage: number;
  pageInputValue: string;
  canNavigate: boolean;
  maxSyncedPage: number | null;
  displayMode: 'paged' | 'continuous';
  continuousScrollRatio: number;
  onNumPagesChange: (numPages: number | null) => void;
  onContinuousScrollRatioChange: (ratio: number) => void;
  onPageInputChange: (value: string) => void;
  onPageInputCommit: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function PdfPreviewPane({
  fileId,
  fileName,
  title,
  loadingLabel,
  errorLabel,
  currentPage,
  pageInputValue,
  canNavigate,
  maxSyncedPage,
  displayMode,
  continuousScrollRatio,
  onNumPagesChange,
  onContinuousScrollRatioChange,
  onPageInputChange,
  onPageInputCommit,
  onPreviousPage,
  onNextPage,
}: PdfPreviewPaneProps) {
  const t = useTranslations('documents.preview');
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const onNumPagesChangeRef = useRef(onNumPagesChange);
  const isProgrammaticScrollRef = useRef(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pdfDocument, setPdfDocument] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [pageDimensionsByPage, setPageDimensionsByPage] = useState<Record<number, { width: number; height: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onNumPagesChangeRef.current = onNumPagesChange;
  }, [onNumPagesChange]);

  useEffect(() => {
    if (displayMode !== 'continuous') {
      isProgrammaticScrollRef.current = false;
    }
  }, [displayMode]);

  useEffect(() => {
    let isActive = true;

    async function loadPreview() {
      setIsLoading(true);
      setError(null);
      setFileUrl(null);
      setNumPages(0);
      setPdfDocument(null);
      setPageDimensionsByPage({});
      onNumPagesChangeRef.current(null);

      try {
        const { download_url } = await getFileDownloadUrl(fileId, { pdf: true });

        if (!isActive) return;

        setFileUrl(download_url);
      } catch (err) {
        if (!isActive) return;

        setError(err instanceof Error ? err.message : errorLabel);
        setIsLoading(false);
        onNumPagesChangeRef.current(null);
      }
    }

    void loadPreview();

    return () => {
      isActive = false;
    };
  }, [errorLabel, fileId]);

  useEffect(() => {
    const container = viewportRef.current;

    if (!container) {
      return;
    }

    const measureViewport = () => {
      const nextWidth = container.clientWidth > 0 ? container.clientWidth : 0;
      const nextHeight = container.clientHeight > 0 ? container.clientHeight : 0;

      setCanvasSize((currentSize) => {
        if (currentSize.width === nextWidth && currentSize.height === nextHeight) {
          return currentSize;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    measureViewport();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measureViewport);

      return () => {
        window.removeEventListener('resize', measureViewport);
      };
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.floor(entry?.contentRect.width ?? container.clientWidth);
      const nextHeight = Math.floor(entry?.contentRect.height ?? container.clientHeight);

      setCanvasSize((currentSize) => {
        const normalizedWidth = nextWidth > 0 ? nextWidth : 0;
        const normalizedHeight = nextHeight > 0 ? nextHeight : 0;

        if (
          currentSize.width === normalizedWidth &&
          currentSize.height === normalizedHeight
        ) {
          return currentSize;
        }

        return {
          width: normalizedWidth,
          height: normalizedHeight,
        };
      });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!pdfDocument || !fileUrl || !currentPage) {
      return;
    }

    let isActive = true;

    async function loadPageDimensions() {
      try {
        const pdfPage = await pdfDocument.getPage(currentPage);

        if (!isActive) {
          return;
        }

        const viewport = pdfPage.getViewport({ scale: 1 });

        setPageDimensionsByPage((currentDimensions) => {
          const existingDimensions = currentDimensions[currentPage];

          if (
            existingDimensions &&
            existingDimensions.width === viewport.width &&
            existingDimensions.height === viewport.height
          ) {
            return currentDimensions;
          }

          return {
            ...currentDimensions,
            [currentPage]: {
              width: viewport.width,
              height: viewport.height,
            },
          };
        });
      } catch (pageError) {
        if (!isActive) {
          return;
        }

        setError(pageError instanceof Error ? pageError.message : errorLabel);
      }
    }

    void loadPageDimensions();

    return () => {
      isActive = false;
    };
  }, [currentPage, errorLabel, fileUrl, pdfDocument]);

  function handleDocumentLoadSuccess(pdf: pdfjs.PDFDocumentProxy) {
    setPdfDocument(pdf);
    setPageDimensionsByPage({});
    const totalPages = pdf.numPages;
    setNumPages(totalPages);
    setIsLoading(false);
    setError(null);
    onNumPagesChangeRef.current(totalPages);
  }

  function handleDocumentLoadError(loadError: Error) {
    setNumPages(0);
    setPdfDocument(null);
    setPageDimensionsByPage({});
    setError(loadError.message || errorLabel);
    setIsLoading(false);
    onNumPagesChangeRef.current(null);
  }

  function handlePageInputValueChange(value: string) {
    if (value === '' || /^\d+$/.test(value)) {
      onPageInputChange(value);
    }
  }

  function handlePageInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onPageInputCommit();
    }
  }

  const isPagedMode = displayMode === 'paged';
  const controlsDisabled = !canNavigate || isLoading || !!error;
  const showSyncHint = isPagedMode && maxSyncedPage !== null && numPages > maxSyncedPage;
  const pageDimensions = pageDimensionsByPage[currentPage] ?? { width: 0, height: 0 };
  const availableCanvasWidth = canvasSize.width > 8 ? canvasSize.width - 8 : canvasSize.width;
  const availableCanvasHeight = canvasSize.height > 8 ? canvasSize.height - 8 : canvasSize.height;
  const widthFitScale =
    availableCanvasWidth > 0 && pageDimensions.width > 0
      ? availableCanvasWidth / pageDimensions.width
      : 0;
  const heightFitScale =
    availableCanvasHeight > 0 && pageDimensions.height > 0
      ? availableCanvasHeight / pageDimensions.height
      : 0;
  const fitScale =
    widthFitScale > 0 && heightFitScale > 0
      ? Math.min(widthFitScale, heightFitScale, 1)
      : 0;
  const canRenderPagedPage = fileUrl && !error && fitScale > 0;
  const continuousPageWidth = canvasSize.width > 0 ? Math.max(canvasSize.width - 2, 1) : undefined;
  const isPageDimensionsLoading = isPagedMode && !!fileUrl && !error && !!pdfDocument && fitScale === 0;
  const shellIsLoading = isLoading || isPageDimensionsLoading;

  const handleContinuousScroll = useCallback(() => {
    if (displayMode !== 'continuous') {
      return;
    }

    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    if (isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      return;
    }

    const maxScrollableTop = container.scrollHeight - container.clientHeight;

    if (maxScrollableTop <= 0) {
      onContinuousScrollRatioChange(0);
      return;
    }

    onContinuousScrollRatioChange(container.scrollTop / maxScrollableTop);
  }, [displayMode, onContinuousScrollRatioChange]);

  useEffect(() => {
    if (displayMode !== 'continuous') {
      return;
    }

    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const maxScrollableTop = container.scrollHeight - container.clientHeight;

    if (maxScrollableTop <= 0) {
      return;
    }

    const nextScrollTop = continuousScrollRatio * maxScrollableTop;

    if (Math.abs(container.scrollTop - nextScrollTop) < 1) {
      return;
    }

    isProgrammaticScrollRef.current = true;
    container.scrollTop = nextScrollTop;
  }, [continuousScrollRatio, displayMode, numPages]);

  return (
    <PreviewPaneShell
      isLoading={shellIsLoading}
      loadingLabel={loadingLabel}
      error={error}
      errorLabel={errorLabel}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex flex-col gap-2 border-b border-border/60 bg-muted/10 px-3 py-2.5 sm:px-4">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex min-w-0 flex-1 basis-64 items-center gap-2 text-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileTypeIcon fileName={fileName} className="size-4" />
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-2 leading-tight">
                <p className="shrink-0 font-medium text-foreground">{title}</p>
                <p className="min-w-0 truncate text-xs text-muted-foreground">{fileName}</p>
              </div>
            </div>

            {isPagedMode ? (
              <div className="ml-auto flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:max-w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onPreviousPage}
                  disabled={controlsDisabled || currentPage <= 1}
                  aria-label={t('previousPage')}
                  className="h-8 shrink-0 px-2.5"
                >
                  <ChevronLeft className="size-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onNextPage}
                  disabled={controlsDisabled || (maxSyncedPage !== null && currentPage >= maxSyncedPage)}
                  aria-label={t('nextPage')}
                  className="h-8 shrink-0 px-2.5"
                >
                  <ChevronRight className="size-4" />
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0">{t('page')}</span>
                  <Input
                    value={pageInputValue}
                    onChange={(event) => handlePageInputValueChange(event.target.value)}
                    onBlur={onPageInputCommit}
                    onKeyDown={handlePageInputKeyDown}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={controlsDisabled}
                    aria-label={t('pageInputLabel')}
                    className="h-8 w-16 bg-background sm:w-20"
                  />
                </div>

                <span className="text-sm text-muted-foreground sm:text-right">
                  {t('pageStatus', { current: currentPage, total: numPages > 0 ? numPages : '-' })}
                </span>
              </div>
            ) : null}
          </div>

          {showSyncHint ? (
            <p className="text-xs text-muted-foreground">
              {t('syncedThrough', { page: maxSyncedPage })}
            </p>
          ) : null}
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleContinuousScroll}
          className={`min-h-0 flex-1 bg-muted/15 p-4 ${isPagedMode ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}
        >
          <div
            ref={viewportRef}
            className={`mx-auto w-full max-w-full ${isPagedMode ? 'flex h-full items-center justify-center overflow-hidden' : 'min-h-full'}`}
          >
            {fileUrl && canvasSize.width > 0 && !error ? (
              <Document
                file={fileUrl}
                loading={null}
                noData={null}
                error={null}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                onSourceError={handleDocumentLoadError}
              >
                <div
                  className={
                    isLoading
                      ? 'hidden'
                      : isPagedMode
                        ? 'flex h-full w-full items-center justify-center'
                        : 'flex flex-col items-center gap-4 pb-1'
                  }
                >
                  {isPagedMode ? (
                    canRenderPagedPage ? (
                      <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-lg">
                        <Page
                          key={`pdf-page-${currentPage}`}
                          pageNumber={currentPage}
                          scale={fitScale}
                          devicePixelRatio={1}
                          loading={null}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      </div>
                    ) : null
                  ) : continuousPageWidth ? (
                    Array.from({ length: numPages }, (_, index) => (
                      <div
                        key={`pdf-page-${index + 1}`}
                        className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-lg"
                      >
                        <Page
                          pageNumber={index + 1}
                          width={continuousPageWidth}
                          devicePixelRatio={1}
                          loading={null}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      </div>
                    ))
                  ) : null}
                </div>
              </Document>
            ) : null}
          </div>
        </div>
      </div>
    </PreviewPaneShell>
  );
}
