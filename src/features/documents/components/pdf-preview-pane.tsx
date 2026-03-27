'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
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
}

export function PdfPreviewPane({
  fileId,
  fileName,
  title,
  loadingLabel,
  errorLabel,
}: PdfPreviewPaneProps) {
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

      try {
        const { download_url } = await getFileDownloadUrl(fileId, { pdf: true });

        if (!isActive) return;

        setFileUrl(download_url);
      } catch (err) {
        if (!isActive) return;

        setError(err instanceof Error ? err.message : errorLabel);
        setIsLoading(false);
      }
    }

    void loadPreview();

    return () => {
      isActive = false;
    };
  }, [errorLabel, fileId]);

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
  }

  function handleDocumentLoadError(loadError: Error) {
    setError(loadError.message || errorLabel);
    setIsLoading(false);
  }

  return (
    <PreviewPaneShell
      title={title}
      fileName={fileName}
      icon={<FileTypeIcon fileName={fileName} className="size-5" />}
      isLoading={isLoading}
      loadingLabel={loadingLabel}
      error={error}
      errorLabel={errorLabel}
    >
      <div className="h-full overflow-auto bg-muted/15 p-4">
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
              <div className={isLoading ? 'hidden' : 'flex flex-col gap-4 pb-1'}>
                {Array.from({ length: numPages }, (_, index) => (
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
                ))}
              </div>
            </Document>
          ) : null}
        </div>
      </div>
    </PreviewPaneShell>
  );
}
