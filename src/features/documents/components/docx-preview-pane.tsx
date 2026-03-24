'use client';

import { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { getFileDownloadUrl } from '../api/documents.api';
import { PreviewPaneShell } from './preview-pane-shell';
import { FileTypeIcon } from '@/components/shared/file-type-icon';

interface DocxPreviewPaneProps {
  fileId: string;
  fileName: string;
  title: string;
  loadingLabel: string;
  errorLabel: string;
}

export function DocxPreviewPane({
  fileId,
  fileName,
  title,
  loadingLabel,
  errorLabel,
}: DocxPreviewPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const container = containerRef.current;

    async function loadPreview() {
      if (!container) return;

      setIsLoading(true);
      setError(null);
      container.innerHTML = '';

      try {
        const { download_url } = await getFileDownloadUrl(fileId);
        const response = await fetch(download_url);

        if (!response.ok) {
          throw new Error(`Failed to fetch DOCX preview (${response.status})`);
        }

        const buffer = await response.arrayBuffer();

        if (!isActive) return;

        await renderAsync(buffer, container, container, {
          className: 'docx-preview-pane',
          inWrapper: true,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          experimental: true,
        });
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : errorLabel);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadPreview();

    return () => {
      isActive = false;
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [errorLabel, fileId]);

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
        <div
          ref={containerRef}
          className="h-full overflow-auto bg-muted/15 p-4 text-foreground [&_.docx-preview-pane-wrapper]:min-h-full [&_.docx-preview-pane-wrapper]:items-start [&_.docx-preview-pane-wrapper]:bg-transparent [&_.docx-preview-pane-wrapper]:p-0 [&_.docx-preview-pane-wrapper]:pb-0 [&_.docx-preview-pane-wrapper>section.docx-preview-pane]:mb-4 [&_.docx-preview-pane-wrapper>section.docx-preview-pane]:shadow-lg [&_.docx-preview-pane]:mx-0 [&_.docx-preview-pane]:max-w-full"
        />
    </PreviewPaneShell>
  );
}
