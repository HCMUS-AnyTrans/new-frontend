'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  previewNavigationReducer,
  initialPreviewNavigationState,
  clampNavigationPage,
  type DocumentPreviewPaneId,
} from './document-preview-navigation';
import {
  useDocumentPreviewPreferences,
  type DocumentPreviewDisplayMode,
  type PreviewZoomMode,
} from './document-preview-preferences';

export type { DocumentPreviewDisplayMode, PreviewZoomMode };
export type { DocumentPreviewPaneId };

export function useDocumentPreviewController(params: {
  jobId: string | null;
  inputFileId: string | null;
  outputFileId: string | null;
}) {
  const { jobId, inputFileId, outputFileId } = params;
  const [navigationState, dispatch] = useReducer(
    previewNavigationReducer,
    initialPreviewNavigationState,
  );
  const {
    currentPage,
    currentVisiblePage,
    pageInputValue,
    jumpToPageInput,
    continuousJumpCommand,
    inputNumPages,
    outputNumPages,
  } = navigationState;
  const nextContinuousJumpCommandIdRef = useRef(0);
  const {
    displayMode,
    zoomMode,
    zoomScale,
    setDisplayMode,
    setZoomMode,
    incrementZoom,
    decrementZoom,
  } = useDocumentPreviewPreferences();

  const maxAvailablePage = useMemo(() => {
    const inputPages = inputNumPages ?? 0;
    const outputPages = outputNumPages ?? 0;
    const nextMaxPage = Math.max(inputPages, outputPages);

    return nextMaxPage > 0 ? nextMaxPage : null;
  }, [inputNumPages, outputNumPages]);
  const canNavigate = !!maxAvailablePage && maxAvailablePage >= 1;

  const commitPage = useCallback(
    (nextPage: number) => {
      dispatch({ type: 'commit-page', page: nextPage, maxPage: maxAvailablePage });
    },
    [maxAvailablePage],
  );

  const handlePageInputChange = useCallback((nextValue: string) => {
    if (nextValue === '' || /^\d+$/.test(nextValue)) {
      dispatch({ type: 'set-page-input', value: nextValue });
    }
  }, []);

  const handlePageInputCommit = useCallback(() => {
    if (pageInputValue === '') {
      dispatch({ type: 'set-page-input', value: String(currentPage) });
      return;
    }

    const parsedPage = Number.parseInt(pageInputValue, 10);

    if (Number.isNaN(parsedPage)) {
      dispatch({ type: 'set-page-input', value: String(currentPage) });
      return;
    }

    commitPage(parsedPage);
  }, [commitPage, currentPage, pageInputValue]);

  const handleJumpToPageInputChange = useCallback((nextValue: string) => {
    if (nextValue === '' || /^\d+$/.test(nextValue)) {
      dispatch({ type: 'set-jump-to-page-input', value: nextValue });
    }
  }, []);

  const handleJumpToPageCommit = useCallback(() => {
    if (!canNavigate) {
      return;
    }

    if (jumpToPageInput === '') {
      dispatch({ type: 'set-jump-to-page-input', value: String(currentVisiblePage) });
      return;
    }

    const parsedPage = Number.parseInt(jumpToPageInput, 10);

    if (Number.isNaN(parsedPage)) {
      dispatch({ type: 'set-jump-to-page-input', value: String(currentVisiblePage) });
      return;
    }

    const nextCommandId = nextContinuousJumpCommandIdRef.current + 1;

    dispatch({
      type: 'commit-continuous-jump',
      page: parsedPage,
      maxPage: maxAvailablePage,
      commandId: nextCommandId,
    });
    nextContinuousJumpCommandIdRef.current = nextCommandId;
  }, [canNavigate, currentVisiblePage, jumpToPageInput, maxAvailablePage]);

  const handlePreviousPage = useCallback(() => {
    commitPage(currentPage - 1);
  }, [commitPage, currentPage]);

  const handleNextPage = useCallback(() => {
    commitPage(currentPage + 1);
  }, [commitPage, currentPage]);

  const handleInputNumPagesChange = useCallback((numPages: number | null) => {
    dispatch({ type: 'set-input-num-pages', numPages });
  }, []);

  const handleOutputNumPagesChange = useCallback((numPages: number | null) => {
    dispatch({ type: 'set-output-num-pages', numPages });
  }, []);

  const setCurrentVisiblePage = useCallback(
    (nextPage: number) => {
      dispatch({ type: 'set-current-visible-page', page: nextPage, maxPage: maxAvailablePage });
    },
    [maxAvailablePage],
  );

  const goToPreviousPage = useCallback(() => {
    const pageBase = displayMode === 'continuous' ? currentVisiblePage : currentPage;
    const nextPage = clampNavigationPage(pageBase - 1, maxAvailablePage);

    if (displayMode === 'continuous') {
      dispatch({ type: 'set-jump-to-page-input', value: String(nextPage) });
      const nextCommandId = nextContinuousJumpCommandIdRef.current + 1;
      dispatch({
        type: 'commit-continuous-jump',
        page: nextPage,
        maxPage: maxAvailablePage,
        commandId: nextCommandId,
      });
      nextContinuousJumpCommandIdRef.current = nextCommandId;
      return;
    }

    commitPage(nextPage);
  }, [commitPage, currentPage, currentVisiblePage, displayMode, maxAvailablePage]);

  const goToNextPage = useCallback(() => {
    const pageBase = displayMode === 'continuous' ? currentVisiblePage : currentPage;
    const nextPage = clampNavigationPage(pageBase + 1, maxAvailablePage);

    if (displayMode === 'continuous') {
      dispatch({ type: 'set-jump-to-page-input', value: String(nextPage) });
      const nextCommandId = nextContinuousJumpCommandIdRef.current + 1;
      dispatch({
        type: 'commit-continuous-jump',
        page: nextPage,
        maxPage: maxAvailablePage,
        commandId: nextCommandId,
      });
      nextContinuousJumpCommandIdRef.current = nextCommandId;
      return;
    }

    commitPage(nextPage);
  }, [commitPage, currentPage, currentVisiblePage, displayMode, maxAvailablePage]);

  useEffect(() => {
    dispatch({ type: 'reset-navigation' });
  }, [inputFileId, jobId, outputFileId]);

  useEffect(() => {
    if (maxAvailablePage === null) {
      return;
    }

    dispatch({ type: 'clamp-page', maxPage: maxAvailablePage });
  }, [maxAvailablePage]);

  return {
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
  };
}
