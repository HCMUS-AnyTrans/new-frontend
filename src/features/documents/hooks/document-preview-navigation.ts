'use client';

export type DocumentPreviewPaneId = 'input' | 'output';

export type PreviewNavigationState = {
  currentPage: number;
  currentVisiblePage: number;
  pageInputValue: string;
  jumpToPageInput: string;
  continuousJumpCommand: { id: number; page: number } | null;
  inputNumPages: number | null;
  outputNumPages: number | null;
};

type PreviewNavigationAction =
  | { type: 'reset-navigation' }
  | { type: 'commit-page'; page: number; maxPage: number | null }
  | { type: 'set-page-input'; value: string }
  | { type: 'set-jump-to-page-input'; value: string }
  | { type: 'commit-continuous-jump'; page: number; maxPage: number | null; commandId: number }
  | { type: 'set-input-num-pages'; numPages: number | null }
  | { type: 'set-output-num-pages'; numPages: number | null }
  | { type: 'clamp-page'; maxPage: number }
  | { type: 'set-current-visible-page'; page: number; maxPage: number | null };

export const initialPreviewNavigationState: PreviewNavigationState = {
  currentPage: 1,
  currentVisiblePage: 1,
  pageInputValue: '1',
  jumpToPageInput: '1',
  continuousJumpCommand: null,
  inputNumPages: null,
  outputNumPages: null,
};

function clampPage(page: number, maxPage: number | null): number {
  if (!maxPage) {
    return 1;
  }

  return Math.min(Math.max(page, 1), maxPage);
}

function syncCommittedPage(
  state: PreviewNavigationState,
  page: number,
): PreviewNavigationState {
  const nextPageValue = String(page);

  if (
    state.currentPage === page &&
    state.currentVisiblePage === page &&
    state.pageInputValue === nextPageValue
  ) {
    return state;
  }

  return {
    ...state,
    currentPage: page,
    currentVisiblePage: page,
    pageInputValue: nextPageValue,
  };
}

function clampNavigationState(
  state: PreviewNavigationState,
  maxPage: number,
): PreviewNavigationState {
  const clampedPage = clampPage(state.currentPage, maxPage);
  const clampedVisiblePage = clampPage(state.currentVisiblePage, maxPage);

  if (
    state.currentPage === clampedPage &&
    state.currentVisiblePage === clampedVisiblePage &&
    state.pageInputValue === String(clampedPage)
  ) {
    return state;
  }

  return {
    ...state,
    currentPage: clampedPage,
    currentVisiblePage: clampedVisiblePage,
    pageInputValue: String(clampedPage),
  };
}

export function previewNavigationReducer(
  state: PreviewNavigationState,
  action: PreviewNavigationAction,
): PreviewNavigationState {
  switch (action.type) {
    case 'reset-navigation':
      return initialPreviewNavigationState;
    case 'commit-page':
      return syncCommittedPage(state, clampPage(action.page, action.maxPage));
    case 'set-page-input':
      if (state.pageInputValue === action.value) {
        return state;
      }

      return {
        ...state,
        pageInputValue: action.value,
      };
    case 'set-jump-to-page-input':
      if (state.jumpToPageInput === action.value) {
        return state;
      }

      return {
        ...state,
        jumpToPageInput: action.value,
      };
    case 'commit-continuous-jump': {
      const nextPage = clampPage(action.page, action.maxPage);
      const nextPageValue = String(nextPage);

      return {
        ...state,
        currentPage: nextPage,
        currentVisiblePage: nextPage,
        pageInputValue: nextPageValue,
        jumpToPageInput: nextPageValue,
        continuousJumpCommand: {
          id: action.commandId,
          page: nextPage,
        },
      };
    }
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
    case 'clamp-page':
      return clampNavigationState(state, action.maxPage);
    case 'set-current-visible-page': {
      const nextVisiblePage = clampPage(action.page, action.maxPage);

      if (state.currentVisiblePage === nextVisiblePage) {
        return state;
      }

      return {
        ...state,
        currentVisiblePage: nextVisiblePage,
      };
    }
    default:
      return state;
  }
}

export function clampNavigationPage(page: number, maxPage: number | null): number {
  return clampPage(page, maxPage);
}
