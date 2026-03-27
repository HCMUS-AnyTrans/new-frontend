'use client';

import { useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileTypeIcon } from '@/components/shared/file-type-icon';
import type {
  DocumentPreviewPaneId,
  PreviewZoomMode,
} from '../hooks/use-document-preview-controller';
import {
  useContinuousPreviewSync,
  usePdfPreviewDocument,
  usePdfPreviewRenderModel,
  usePdfPreviewViewport,
} from '../hooks';
import { PreviewPaneShell } from './preview-pane-shell';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfPreviewPaneProps {
  paneId: DocumentPreviewPaneId;
  fileId: string;
  fileName: string;
  title: string;
  loadingLabel: string;
  errorLabel: string;
  currentPage: number;
  displayMode: 'paged' | 'continuous';
  zoomMode: PreviewZoomMode;
  zoomScale: number;
  currentVisiblePage: number;
  continuousJumpCommand: { id: number; page: number } | null;
  isVisiblePageAuthority: boolean;
  continuousScrollRatio: number;
  onContinuousInteractionStart: (pane: DocumentPreviewPaneId) => void;
  onNumPagesChange: (numPages: number | null) => void;
  onContinuousScrollRatioChange: (ratio: number) => void;
  onCurrentVisiblePageChange: (page: number) => void;
}

export function PdfPreviewPane({
  paneId,
  fileId,
  fileName,
  title,
  loadingLabel,
  errorLabel,
  currentPage,
  displayMode,
  zoomMode,
  zoomScale,
  currentVisiblePage,
  continuousJumpCommand,
  isVisiblePageAuthority,
  continuousScrollRatio,
  onContinuousInteractionStart,
  onNumPagesChange,
  onContinuousScrollRatioChange,
  onCurrentVisiblePageChange,
}: PdfPreviewPaneProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    fileUrl,
    numPages,
    pdfDocument,
    pageDimensionsByPage,
    isLoading,
    error,
    handleDocumentLoadSuccess,
    handleDocumentLoadError,
  } = usePdfPreviewDocument({
    fileId,
    errorLabel,
    currentPage,
    onNumPagesChange,
  });
  const canvasSize = usePdfPreviewViewport(viewportRef);

  const {
    isPagedMode,
    safeZoomScale,
    effectiveZoomMode,
    renderDevicePixelRatio,
    effectivePageNumber,
    effectivePagedScale,
    canRenderPagedPage,
    continuousPageWidth,
    isPageDimensionsLoading,
  } = usePdfPreviewRenderModel({
    currentPage,
    displayMode,
    zoomMode,
    zoomScale,
    numPages,
    canvasSize,
    pageDimensionsByPage,
    fileUrl,
    error,
    pdfDocumentReady: !!pdfDocument,
  });
  const shellIsLoading = isLoading || isPageDimensionsLoading;
  const {
    handleContinuousScroll,
    setContinuousPageWrapperRef,
    resetContinuousPageWrapperRefs,
  } = useContinuousPreviewSync({
    paneId,
    displayMode,
    numPages,
    currentVisiblePage,
    continuousJumpCommand,
    isVisiblePageAuthority,
    continuousScrollRatio,
    canvasSize,
    effectiveZoomMode,
    safeZoomScale,
    scrollContainerRef,
    onContinuousInteractionStart,
    onContinuousScrollRatioChange,
    onCurrentVisiblePageChange,
  });

  useEffect(() => {
    resetContinuousPageWrapperRefs();
  }, [fileId, resetContinuousPageWrapperRefs]);

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
                <p className="min-w-0 truncate text-xs text-muted-foreground">
                  {fileName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleContinuousScroll}
          className={`min-h-0 flex-1 ${
            isPagedMode
              ? effectiveZoomMode === 'fit-page'
                ? 'overflow-hidden'
                : 'overflow-auto'
              : effectiveZoomMode === 'custom'
                ? 'overflow-auto'
                : 'overflow-y-auto overflow-x-hidden'
          }`}
        >
          <div
            ref={viewportRef}
            className={`mx-auto w-full max-w-full ${
              isPagedMode
                ? effectiveZoomMode === 'fit-page'
                  ? 'flex h-full items-center justify-center overflow-hidden'
                  : 'flex min-h-full items-start justify-center'
                : 'min-h-full'
            }`}
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
                        : 'flex flex-col items-center gap-2'
                  }
                >
                  {isPagedMode ? (
                    canRenderPagedPage ? (
                      <div className="overflow-hidden bg-background">
                        <Page
                          key={`pdf-page-${currentPage}`}
                          pageNumber={effectivePageNumber}
                          scale={effectivePagedScale}
                          devicePixelRatio={renderDevicePixelRatio}
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
                        ref={(node) =>
                          setContinuousPageWrapperRef(index + 1, node)
                        }
                        data-page-number={index + 1}
                        className="overflow-hidden bg-background"
                      >
                        <Page
                          pageNumber={index + 1}
                          width={
                            effectiveZoomMode === 'fit-width'
                              ? continuousPageWidth
                              : undefined
                          }
                          scale={
                            effectiveZoomMode === 'custom'
                              ? safeZoomScale
                              : undefined
                          }
                          devicePixelRatio={renderDevicePixelRatio}
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
