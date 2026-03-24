'use client';

import { Eye, FileWarning, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DocxPreviewPane } from './docx-preview-pane';
import { PdfPreviewPane } from './pdf-preview-pane';
import { useTranslationJob } from '../hooks';
import { getPreviewConfig } from '../utils/preview-capabilities';
import { Link } from '@/i18n/navigation';

function PreviewState({
  title,
  description,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex min-h-[calc(100vh-var(--dashboard-header-height)-4rem)] items-center justify-center">
      <Alert className="max-w-xl border-border/70 bg-background/90 shadow-sm">
        <FileWarning className="size-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>{description}</p>
          <Button asChild variant="outline">
            <Link href="/documents">{ctaLabel}</Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function DocumentPreviewScreen() {
  const t = useTranslations('documents.preview');
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const {
    data: job,
    isLoading,
    isError,
  } = useTranslationJob(jobId, {
    enabled: !!jobId,
    pollInterval: false,
  });

  if (!jobId) {
    return (
      <PreviewState
        title={t('missingJobTitle')}
        description={t('missingJobDescription')}
        ctaLabel={t('backToDocuments')}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-var(--dashboard-header-height)-4rem)] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {t('loadingJob')}
      </div>
    );
  }

  if (isError || !job) {
    return (
      <PreviewState
        title={t('loadErrorTitle')}
        description={t('loadErrorDescription')}
        ctaLabel={t('backToDocuments')}
      />
    );
  }

  if (job.status !== 'succeeded' || !job.input_file || !job.output_file) {
    return (
      <PreviewState
        title={t('notReadyTitle')}
        description={t('notReadyDescription')}
        ctaLabel={t('backToDocuments')}
      />
    );
  }

  const previewConfig = getPreviewConfig({
    inputFile: job.input_file,
    outputFile: job.output_file,
  });

  if (!previewConfig) {
    return (
      <PreviewState
        title={t('unsupportedTitle')}
        description={t('unsupportedDescription')}
        ctaLabel={t('backToDocuments')}
      />
    );
  }

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-var(--dashboard-header-height))] flex-col px-4 md:-mx-[var(--dashboard-content-margin)] md:px-6 xl:px-8">
      <div className="border-b border-border/60 bg-muted/20 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Eye className="size-4" />
              <span className="text-sm font-medium">{t('eyebrow')}</span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              {t('title')}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('description')}
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/documents">{t('backToDocuments')}</Link>
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 py-4 lg:py-6">
        <div className="grid min-h-0 w-full grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
          {previewConfig.original === 'pdf' ? (
            <PdfPreviewPane
              fileId={job.input_file.id}
              fileName={job.input_file.name}
              title={t('original')}
              loadingLabel={t('loadingOriginal')}
              errorLabel={t('renderError')}
            />
          ) : (
            <DocxPreviewPane
              fileId={job.input_file.id}
              fileName={job.input_file.name}
              title={t('original')}
              loadingLabel={t('loadingOriginal')}
              errorLabel={t('renderError')}
            />
          )}

          <DocxPreviewPane
            fileId={job.output_file.id}
            fileName={job.output_file.name}
            title={t('translated')}
            loadingLabel={t('loadingTranslated')}
            errorLabel={t('renderError')}
          />
        </div>
      </div>
    </div>
  );
}
