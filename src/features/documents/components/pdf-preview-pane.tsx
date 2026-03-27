'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  onNumPagesChange: (numPages: number | null) => void;
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
  onNumPagesChange,
  onPageInputChange,
  onPageInputCommit,
  onPreviousPage,
  onNextPage,
}: PdfPreviewPaneProps) {
  const t = useTranslations('documents.preview');
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadPreview() {
      setIsLoading(true);
      setError(null);
      setFileUrl(null);
      setNumPages(0);
      onNumPagesChange(null);

      try {
        const { download_url } = await getFileDownloadUrl(fileId, { pdf: true });

        if (!isActive) return;

        setFileUrl(download_url);
      } catch (err) {
        if (!isActive) return;

        setError(err instanceof Error ? err.message : errorLabel);
        setIsLoading(false);
        onNumPagesChange(null);
      }
    }

    void loadPreview();

    return () => {
      isActive = false;
    };
  }, [errorLabel, fileId, onNumPagesChange]);

  useEffect(() => {
    const container = viewportRef.current;

    if (!container || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.floor(entry?.contentRect.width ?? container.clientWidth);
      setPageWidth(nextWidth > 0 ? nextWidth : 0);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  function handleDocumentLoadSuccess({ numPages: totalPages }: { numPages: number }) {
    setNumPages(totalPages);
    setIsLoading(false);
    setError(null);
    onNumPagesChange(totalPages);
  }

  function handleDocumentLoadError(loadError: Error) {
    setNumPages(0);
    setError(loadError.message || errorLabel);
    setIsLoading(false);
    onNumPagesChange(null);
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

  const controlsDisabled = !canNavigate || isLoading || !!error;
  const showSyncHint = maxSyncedPage !== null && numPages > maxSyncedPage;
  const isPagedMode = displayMode === 'paged';

  return (
    <PreviewPaneShell
      isLoading={isLoading}
      loadingLabel={loadingLabel}
      error={error}
      errorLabel={errorLabel}
    >
      <div className="flex flex-col gap-2 border-b border-border/60 bg-muted/10 px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex min-w-0 max-w-full items-center gap-2 text-sm sm:max-w-[42%] xl:max-w-[45%]">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileTypeIcon fileName={fileName} className="size-4" />
            </div>

            <div className="flex min-w-0 items-center gap-2 leading-tight">
              <p className="shrink-0 font-medium text-foreground">{title}</p>
              <p className="truncate text-xs text-muted-foreground">{fileName}</p>
            </div>
          </div>

          {isPagedMode ? (
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPreviousPage}
                disabled={controlsDisabled || currentPage <= 1}
                aria-label={t('previousPage')}
                className="w-full sm:w-auto"
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
                className="w-full sm:w-auto"
              >
                <ChevronRight className="size-4" />
              </Button>

              <div className="col-span-2 flex items-center gap-2 text-sm text-muted-foreground sm:col-span-1">
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

              <span className="col-span-2 text-sm text-muted-foreground sm:col-span-1 sm:text-right">
                {t('pageStatus', { current: currentPage, total: numPages > 0 ? numPages : '-' })}
              </span>
            </div>
          ) : null}
        </div>

        {isPagedMode && showSyncHint ? (
          <p className="text-xs text-muted-foreground">
            {t('syncedThrough', { page: maxSyncedPage })}
          </p>
        ) : null}
      </div>

      <div className={`h-full bg-muted/15 p-4 ${isPagedMode ? 'overflow-auto' : 'overflow-y-auto overflow-x-hidden'}`}>
        <div ref={viewportRef} className="mx-auto min-h-full w-full max-w-full">
          {fileUrl && pageWidth > 0 && !error ? (
            <Document
              file={fileUrl}
              loading={null}
              noData={null}
              error={null}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              onSourceError={handleDocumentLoadError}
            >
              <div className={isLoading ? 'hidden' : isPagedMode ? 'pb-1' : 'flex flex-col gap-4 pb-1'}>
                {isPagedMode ? (
                  <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-lg">
                    <Page
                      pageNumber={currentPage}
                      width={Math.max(pageWidth - 2, 1)}
                      loading={null}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </div>
                ) : (
                  Array.from({ length: numPages }, (_, index) => (
                    <div
                      key={`pdf-page-${index + 1}`}
                      className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-lg"
                    >
                      <Page
                        pageNumber={index + 1}
                        width={Math.max(pageWidth - 2, 1)}
                        loading={null}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </div>
                  ))
                )}
              </div>
            </Document>
          ) : null}
        </div>
      </div>
    </PreviewPaneShell>
  );
}
