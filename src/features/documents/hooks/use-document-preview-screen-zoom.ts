'use client';

import { useCallback, useState } from 'react';
import type {
  DocumentPreviewDisplayMode,
  DocumentPreviewPaneId,
  PreviewZoomMode,
} from './use-document-preview-controller';

type PaneZoomIndicatorState = {
  zoomMode: PreviewZoomMode;
  zoomScale: number | null;
  zoomPercent: number | null;
};

const INITIAL_PANE_ZOOM_STATE: Record<DocumentPreviewPaneId, PaneZoomIndicatorState> = {
  input: {
    zoomMode: 'custom',
    zoomScale: null,
    zoomPercent: null,
  },
  output: {
    zoomMode: 'custom',
    zoomScale: null,
    zoomPercent: null,
  },
};

interface UseDocumentPreviewScreenZoomParams {
  displayMode: DocumentPreviewDisplayMode;
  zoomMode: PreviewZoomMode;
  zoomScale: number;
  continuousInteractionPane: DocumentPreviewPaneId;
  incrementZoom: () => void;
  decrementZoom: () => void;
  incrementZoomFromScale: (scale: number) => void;
  decrementZoomFromScale: (scale: number) => void;
}

export function useDocumentPreviewScreenZoom({
  displayMode,
  zoomMode,
  zoomScale,
  continuousInteractionPane,
  incrementZoom,
  decrementZoom,
  incrementZoomFromScale,
  decrementZoomFromScale,
}: UseDocumentPreviewScreenZoomParams) {
  const [zoomStateByPane, setZoomStateByPane] = useState(INITIAL_PANE_ZOOM_STATE);

  const handleZoomPercentageChange = useCallback(
    (
      pane: DocumentPreviewPaneId,
      nextZoomMode: PreviewZoomMode,
      nextZoomScale: number | null,
      nextZoomPercent: number | null,
    ) => {
      setZoomStateByPane((currentZoomStateByPane) => {
        const currentPaneState = currentZoomStateByPane[pane];

        if (
          currentPaneState.zoomMode === nextZoomMode &&
          currentPaneState.zoomScale === nextZoomScale &&
          currentPaneState.zoomPercent === nextZoomPercent
        ) {
          return currentZoomStateByPane;
        }

        return {
          ...currentZoomStateByPane,
          [pane]: {
            zoomMode: nextZoomMode,
            zoomScale: nextZoomScale,
            zoomPercent: nextZoomPercent,
          },
        };
      });
    },
    [],
  );

  const preferredPane = displayMode === 'continuous' ? continuousInteractionPane : 'input';
  const preferredPaneState = zoomStateByPane[preferredPane];
  const inputPaneState = zoomStateByPane.input;
  const outputPaneState = zoomStateByPane.output;
  const fallbackZoomPercent = Math.round(zoomScale * 100);

  const resolvedZoomPercent =
    (preferredPaneState.zoomMode === zoomMode ? preferredPaneState.zoomPercent : null) ??
    (inputPaneState.zoomMode === zoomMode ? inputPaneState.zoomPercent : null) ??
    (outputPaneState.zoomMode === zoomMode ? outputPaneState.zoomPercent : null) ??
    fallbackZoomPercent;

  const resolvedZoomScale =
    (preferredPaneState.zoomMode === zoomMode ? preferredPaneState.zoomScale : null) ??
    (inputPaneState.zoomMode === zoomMode ? inputPaneState.zoomScale : null) ??
    (outputPaneState.zoomMode === zoomMode ? outputPaneState.zoomScale : null) ??
    zoomScale;

  const handleZoomIn = useCallback(() => {
    if (zoomMode === 'custom') {
      incrementZoom();
      return;
    }

    incrementZoomFromScale(resolvedZoomScale);
  }, [incrementZoom, incrementZoomFromScale, resolvedZoomScale, zoomMode]);

  const handleZoomOut = useCallback(() => {
    if (zoomMode === 'custom') {
      decrementZoom();
      return;
    }

    decrementZoomFromScale(resolvedZoomScale);
  }, [decrementZoom, decrementZoomFromScale, resolvedZoomScale, zoomMode]);

  return {
    resolvedZoomPercent,
    handleZoomPercentageChange,
    handleZoomIn,
    handleZoomOut,
  };
}
