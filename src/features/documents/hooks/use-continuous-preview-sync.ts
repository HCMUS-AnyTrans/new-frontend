'use client';

import { RefObject, useCallback, useEffect, useRef } from 'react';

function getMostVisibleContinuousPage(params: {
  container: HTMLDivElement;
  pageWrappers: Record<number, HTMLDivElement | null>;
  numPages: number;
  fallbackPage: number;
}) {
  const { container, pageWrappers, numPages, fallbackPage } = params;
  const containerRect = container.getBoundingClientRect();
  let bestPage = numPages > 0 ? Math.min(Math.max(fallbackPage, 1), numPages) : 1;
  let bestVisibleHeight = -1;

  for (let pageNumber = 1; pageNumber <= numPages; pageNumber += 1) {
    const pageWrapper = pageWrappers[pageNumber];

    if (!pageWrapper) {
      continue;
    }

    const pageRect = pageWrapper.getBoundingClientRect();
    const visibleTop = Math.max(pageRect.top, containerRect.top);
    const visibleBottom = Math.min(pageRect.bottom, containerRect.bottom);
    const visibleHeight = Math.max(visibleBottom - visibleTop, 0);

    if (visibleHeight > bestVisibleHeight) {
      bestPage = pageNumber;
      bestVisibleHeight = visibleHeight;
    }
  }

  return bestPage;
}

import type { DocumentPreviewPaneId } from './use-document-preview-controller';

interface UseContinuousPreviewSyncParams {
  paneId: DocumentPreviewPaneId;
  displayMode: 'paged' | 'continuous';
  numPages: number;
  currentVisiblePage: number;
  continuousJumpCommand: { id: number; page: number } | null;
  isVisiblePageAuthority: boolean;
  continuousScrollRatio: number;
  canvasSize: { width: number; height: number };
  effectiveZoomMode: 'fit-page' | 'fit-width' | 'custom';
  safeZoomScale: number;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onContinuousInteractionStart: (pane: DocumentPreviewPaneId) => void;
  onContinuousScrollRatioChange: (ratio: number) => void;
  onCurrentVisiblePageChange: (page: number) => void;
}

export function useContinuousPreviewSync({
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
}: UseContinuousPreviewSyncParams) {
  const continuousPageWrapperRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const isProgrammaticScrollRef = useRef(false);
  const isVisiblePageAuthorityRef = useRef(isVisiblePageAuthority);
  const handledContinuousJumpCommandIdRef = useRef<number | null>(null);
  const continuousScrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (displayMode !== 'continuous') {
      isProgrammaticScrollRef.current = false;
    }
  }, [displayMode]);

  useEffect(() => {
    isVisiblePageAuthorityRef.current = isVisiblePageAuthority;
  }, [isVisiblePageAuthority]);

  useEffect(() => {
    if (continuousJumpCommand === null) {
      handledContinuousJumpCommandIdRef.current = null;
    }
  }, [continuousJumpCommand]);

  useEffect(() => {
    return () => {
      if (continuousScrollFrameRef.current !== null) {
        window.cancelAnimationFrame(continuousScrollFrameRef.current);
      }
    };
  }, []);

  const updateCurrentVisiblePage = useCallback(() => {
    if (displayMode !== 'continuous' || numPages < 1) {
      return;
    }

    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const nextVisiblePage = getMostVisibleContinuousPage({
      container,
      pageWrappers: continuousPageWrapperRefs.current,
      numPages,
      fallbackPage: currentVisiblePage,
    });

    if (isVisiblePageAuthorityRef.current) {
      onCurrentVisiblePageChange(nextVisiblePage);
    }
  }, [currentVisiblePage, displayMode, numPages, onCurrentVisiblePageChange, scrollContainerRef]);

  const flushContinuousScrollState = useCallback(() => {
    continuousScrollFrameRef.current = null;

    if (displayMode !== 'continuous') {
      return;
    }

    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    updateCurrentVisiblePage();

    const maxScrollableTop = container.scrollHeight - container.clientHeight;

    if (maxScrollableTop <= 0) {
      onContinuousScrollRatioChange(0);
      return;
    }

    onContinuousScrollRatioChange(container.scrollTop / maxScrollableTop);
  }, [displayMode, onContinuousScrollRatioChange, scrollContainerRef, updateCurrentVisiblePage]);

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

    if (!isVisiblePageAuthorityRef.current) {
      isVisiblePageAuthorityRef.current = true;
      onContinuousInteractionStart(paneId);
    }

    if (continuousScrollFrameRef.current !== null) {
      return;
    }

    continuousScrollFrameRef.current = window.requestAnimationFrame(flushContinuousScrollState);
  }, [displayMode, flushContinuousScrollState, onContinuousInteractionStart, paneId, scrollContainerRef]);

  useEffect(() => {
    if (displayMode !== 'continuous' || numPages < 1) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      updateCurrentVisiblePage();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [canvasSize.height, canvasSize.width, displayMode, effectiveZoomMode, numPages, safeZoomScale, updateCurrentVisiblePage]);

  useEffect(() => {
    if (
      displayMode !== 'continuous' ||
      continuousJumpCommand === null ||
      numPages < continuousJumpCommand.page ||
      handledContinuousJumpCommandIdRef.current === continuousJumpCommand.id
    ) {
      return;
    }

    const container = scrollContainerRef.current;
    const pageWrapper = continuousPageWrapperRefs.current[continuousJumpCommand.page];

    if (!container || !pageWrapper) {
      return;
    }

    const containerTop = container.getBoundingClientRect().top;
    const pageTop = pageWrapper.getBoundingClientRect().top;
    const nextScrollTop = container.scrollTop + (pageTop - containerTop);

    if (Math.abs(container.scrollTop - nextScrollTop) >= 1) {
      isProgrammaticScrollRef.current = true;
      container.scrollTop = nextScrollTop;
    }

    handledContinuousJumpCommandIdRef.current = continuousJumpCommand.id;
  }, [continuousJumpCommand, displayMode, numPages, scrollContainerRef]);

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
  }, [canvasSize.height, canvasSize.width, continuousScrollRatio, displayMode, effectiveZoomMode, numPages, safeZoomScale, scrollContainerRef]);

  function setContinuousPageWrapperRef(pageNumber: number, node: HTMLDivElement | null) {
    continuousPageWrapperRefs.current[pageNumber] = node;
  }

  function resetContinuousPageWrapperRefs() {
    continuousPageWrapperRefs.current = {};
  }

  return {
    handleContinuousScroll,
    setContinuousPageWrapperRef,
    resetContinuousPageWrapperRefs,
  };
}
