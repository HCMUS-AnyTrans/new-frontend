'use client';

import { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { AlertCircle, FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFileDownloadUrl } from '../api/documents.api';

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
    <Card className="flex h-full min-h-0 flex-col overflow-hidden border-border/70 bg-background/80 shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {fileName}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        {isLoading ? (
          <div className="flex h-full min-h-[320px] items-center justify-center gap-3 bg-muted/10 px-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {loadingLabel}
          </div>
        ) : null}

        {error ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{errorLabel}</AlertDescription>
            </Alert>
          </div>
        ) : null}

        <div
          ref={containerRef}
          className="h-full overflow-auto bg-muted/15 p-4 text-foreground [&_.docx-preview-pane-wrapper]:min-h-full [&_.docx-preview-pane-wrapper]:items-start [&_.docx-preview-pane-wrapper]:bg-transparent [&_.docx-preview-pane-wrapper]:p-0 [&_.docx-preview-pane-wrapper]:pb-0 [&_.docx-preview-pane-wrapper>section.docx-preview-pane]:mb-4 [&_.docx-preview-pane-wrapper>section.docx-preview-pane]:shadow-lg [&_.docx-preview-pane]:mx-0 [&_.docx-preview-pane]:max-w-full"
        />
      </CardContent>
    </Card>
  );
}
