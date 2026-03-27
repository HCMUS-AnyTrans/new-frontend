'use client';

import type { PreviewZoomMode } from './use-document-preview-controller';

const MIN_ZOOM_SCALE = 0.5;
const MAX_ZOOM_SCALE = 2;

function clampZoomScale(scale: number) {
  if (!Number.isFinite(scale)) {
    return 1;
  }

  return Math.min(Math.max(scale, MIN_ZOOM_SCALE), MAX_ZOOM_SCALE);
}

interface UsePdfPreviewRenderModelParams {
  currentPage: number;
  displayMode: 'paged' | 'continuous';
  zoomMode: PreviewZoomMode;
  zoomScale: number;
  numPages: number;
  canvasSize: { width: number; height: number };
  pageDimensionsByPage: Record<number, { width: number; height: number }>;
  fileUrl: string | null;
  error: string | null;
  pdfDocumentReady: boolean;
}

export function usePdfPreviewRenderModel({
  currentPage,
  displayMode,
  zoomMode,
  zoomScale,
  numPages,
  canvasSize,
  pageDimensionsByPage,
  fileUrl,
  error,
  pdfDocumentReady,
}: UsePdfPreviewRenderModelParams) {
  const isPagedMode = displayMode === 'paged';
  const safeZoomScale = clampZoomScale(zoomScale);
  const effectiveZoomMode: PreviewZoomMode =
    displayMode === 'continuous' && zoomMode === 'fit-page'
      ? 'fit-width'
      : zoomMode;
  const renderDevicePixelRatio =
    typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  const effectivePageNumber = numPages > 0 ? Math.min(currentPage, numPages) : currentPage;
  const pageDimensions = pageDimensionsByPage[effectivePageNumber] ?? {
    width: 0,
    height: 0,
  };
  const availableCanvasWidth = canvasSize.width > 8 ? canvasSize.width - 8 : canvasSize.width;
  const availableCanvasHeight =
    canvasSize.height > 8 ? canvasSize.height - 8 : canvasSize.height;
  const widthFitScale =
    availableCanvasWidth > 0 && pageDimensions.width > 0
      ? availableCanvasWidth / pageDimensions.width
      : 0;
  const heightFitScale =
    availableCanvasHeight > 0 && pageDimensions.height > 0
      ? availableCanvasHeight / pageDimensions.height
      : 0;
  const fitPageScale =
    widthFitScale > 0 && heightFitScale > 0
      ? Math.min(widthFitScale, heightFitScale, 1)
      : 0;
  const fitWidthScale = widthFitScale > 0 ? clampZoomScale(widthFitScale) : 0;
  const effectivePagedScale =
    effectiveZoomMode === 'fit-page'
      ? fitPageScale
      : effectiveZoomMode === 'fit-width'
        ? fitWidthScale
        : safeZoomScale;
  const requiresPagedMeasurement =
    effectiveZoomMode === 'fit-page' || effectiveZoomMode === 'fit-width';
  const canRenderPagedPage = fileUrl && !error && effectivePagedScale > 0;
  const continuousPageWidth = canvasSize.width > 0 ? Math.max(canvasSize.width - 2, 1) : undefined;
  const isPageDimensionsLoading =
    isPagedMode &&
    requiresPagedMeasurement &&
    !!fileUrl &&
    !error &&
    pdfDocumentReady &&
    effectivePagedScale === 0;

  return {
    isPagedMode,
    safeZoomScale,
    effectiveZoomMode,
    renderDevicePixelRatio,
    effectivePageNumber,
    effectivePagedScale,
    canRenderPagedPage,
    continuousPageWidth,
    isPageDimensionsLoading,
  };
}
