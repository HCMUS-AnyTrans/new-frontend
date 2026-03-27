'use client';

import { useCallback, useEffect, useReducer, useState } from 'react';

function clampPage(page: number, maxPage: number | null): number {
  if (!maxPage) {
    return 1;
  }

  return Math.min(Math.max(page, 1), maxPage);
}

type PreviewNavigationState = {
  currentPage: number;
  pageInputValue: string;
  inputNumPages: number | null;
  outputNumPages: number | null;
};

type PreviewNavigationAction =
  | { type: 'reset' }
  | { type: 'commit-page'; page: number; maxPage: number | null }
  | { type: 'set-page-input'; value: string }
  | { type: 'set-input-num-pages'; numPages: number | null }
  | { type: 'set-output-num-pages'; numPages: number | null }
  | { type: 'clamp-page'; maxPage: number };

const initialPreviewNavigationState: PreviewNavigationState = {
  currentPage: 1,
  pageInputValue: '1',
  inputNumPages: null,
  outputNumPages: null,
};

function previewNavigationReducer(
  state: PreviewNavigationState,
  action: PreviewNavigationAction,
): PreviewNavigationState {
  switch (action.type) {
    case 'reset':
      return initialPreviewNavigationState;
    case 'commit-page': {
      const committedPage = clampPage(action.page, action.maxPage);

      if (
        state.currentPage === committedPage &&
        state.pageInputValue === String(committedPage)
      ) {
        return state;
      }

      return {
        ...state,
        currentPage: committedPage,
        pageInputValue: String(committedPage),
      };
    }
    case 'set-page-input':
      if (state.pageInputValue === action.value) {
        return state;
      }

      return {
        ...state,
        pageInputValue: action.value,
      };
    case 'set-input-num-pages':
      if (state.inputNumPages === action.numPages) {
        return state;
      }

      return {
        ...state,
        inputNumPages: action.numPages,
      };
    case 'set-output-num-pages':
      if (state.outputNumPages === action.numPages) {
        return state;
      }

      return {
        ...state,
        outputNumPages: action.numPages,
      };
    case 'clamp-page': {
      const clampedPage = clampPage(state.currentPage, action.maxPage);

      if (state.currentPage === clampedPage && state.pageInputValue === String(clampedPage)) {
        return state;
      }

      return {
        ...state,
        currentPage: clampedPage,
        pageInputValue: String(clampedPage),
      };
    }
    default:
      return state;
  }
}

export function useDocumentPreviewState(params: {
  jobId: string | null;
  inputFileId: string | null;
  outputFileId: string | null;
}) {
  const { jobId, inputFileId, outputFileId } = params;
  const [previewState, dispatch] = useReducer(
    previewNavigationReducer,
    initialPreviewNavigationState,
  );
  const [displayMode, setDisplayMode] = useState<'paged' | 'continuous'>('paged');
  const { currentPage, pageInputValue, inputNumPages, outputNumPages } = previewState;

  const maxSyncedPage =
    inputNumPages && outputNumPages ? Math.min(inputNumPages, outputNumPages) : null;
  const canNavigate = !!maxSyncedPage && maxSyncedPage >= 1;

  const commitPage = useCallback(
    (nextPage: number) => {
      dispatch({ type: 'commit-page', page: nextPage, maxPage: maxSyncedPage });
    },
    [maxSyncedPage],
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

  useEffect(() => {
    dispatch({ type: 'reset' });
  }, [inputFileId, jobId, outputFileId]);

  useEffect(() => {
    if (maxSyncedPage === null) {
      return;
    }

    dispatch({ type: 'clamp-page', maxPage: maxSyncedPage });
  }, [maxSyncedPage]);

  return {
    currentPage,
    pageInputValue,
    maxSyncedPage,
    canNavigate,
    displayMode,
    setDisplayMode,
    handlePageInputChange,
    handlePageInputCommit,
    handlePreviousPage,
    handleNextPage,
    handleInputNumPagesChange,
    handleOutputNumPagesChange,
  };
}
