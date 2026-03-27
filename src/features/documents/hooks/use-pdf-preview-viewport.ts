'use client';

import { RefObject, useEffect, useState } from 'react';

export function usePdfPreviewViewport(viewportRef: RefObject<HTMLDivElement | null>) {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = viewportRef.current;

    if (!container) {
      return;
    }

    const measureViewport = () => {
      const nextWidth = container.clientWidth > 0 ? container.clientWidth : 0;
      const nextHeight = container.clientHeight > 0 ? container.clientHeight : 0;

      setCanvasSize((currentSize) => {
        if (currentSize.width === nextWidth && currentSize.height === nextHeight) {
          return currentSize;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    measureViewport();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measureViewport);

      return () => {
        window.removeEventListener('resize', measureViewport);
      };
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.floor(entry?.contentRect.width ?? container.clientWidth);
      const nextHeight = Math.floor(entry?.contentRect.height ?? container.clientHeight);

      setCanvasSize((currentSize) => {
        const normalizedWidth = nextWidth > 0 ? nextWidth : 0;
        const normalizedHeight = nextHeight > 0 ? nextHeight : 0;

        if (
          currentSize.width === normalizedWidth &&
          currentSize.height === normalizedHeight
        ) {
          return currentSize;
        }

        return {
          width: normalizedWidth,
          height: normalizedHeight,
        };
      });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [viewportRef]);

  return canvasSize;
}
