'use client';

import { useEffect, useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { getFileDownloadUrl } from '../api/documents.api';

interface UsePdfPreviewDocumentParams {
  fileId: string;
  errorLabel: string;
  currentPage: number;
  onNumPagesChange: (numPages: number | null) => void;
}

export function usePdfPreviewDocument({
  fileId,
  errorLabel,
  currentPage,
  onNumPagesChange,
}: UsePdfPreviewDocumentParams) {
  const onNumPagesChangeRef = useRef(onNumPagesChange);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pdfDocument, setPdfDocument] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [pageDimensionsByPage, setPageDimensionsByPage] = useState<
    Record<number, { width: number; height: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onNumPagesChangeRef.current = onNumPagesChange;
  }, [onNumPagesChange]);

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
    const effectivePageNumber = numPages > 0 ? Math.min(currentPage, numPages) : currentPage;

    if (!pdfDocument || !fileUrl || !effectivePageNumber) {
      return;
    }

    let isActive = true;

    async function loadPageDimensions() {
      try {
        const pdfPage = await pdfDocument.getPage(effectivePageNumber);

        if (!isActive) {
          return;
        }

        const viewport = pdfPage.getViewport({ scale: 1 });

        setPageDimensionsByPage((currentDimensions) => {
          const existingDimensions = currentDimensions[effectivePageNumber];

          if (
            existingDimensions &&
            existingDimensions.width === viewport.width &&
            existingDimensions.height === viewport.height
          ) {
            return currentDimensions;
          }

          return {
            ...currentDimensions,
            [effectivePageNumber]: {
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
  }, [currentPage, errorLabel, fileUrl, numPages, pdfDocument]);

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

  return {
    fileUrl,
    numPages,
    pdfDocument,
    pageDimensionsByPage,
    isLoading,
    error,
    handleDocumentLoadSuccess,
    handleDocumentLoadError,
  };
}
