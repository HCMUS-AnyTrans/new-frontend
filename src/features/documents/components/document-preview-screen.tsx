'use client';

import { ArrowLeft, FileWarning, Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PdfPreviewPane } from './pdf-preview-pane';
import { useTranslationJob } from '../hooks';
import { canPreviewTranslationJob } from '../utils/preview-capabilities';

function PreviewState({
  title,
  description,
  backLabel,
  onBack,
}: {
  title: string;
  description: string;
  backLabel: string;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-var(--dashboard-header-height)-4rem)] items-center justify-center">
      <Alert className="max-w-xl border-border/70 bg-background/90 shadow-sm">
        <FileWarning className="size-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>{description}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="-ml-2 gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function DocumentPreviewScreen() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('documents.preview');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(`/${locale}/documents`);
  }, [locale, router]);

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
        backLabel={tCommon('back')}
        onBack={handleBack}
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
        backLabel={tCommon('back')}
        onBack={handleBack}
      />
    );
  }

  if (job.status !== 'succeeded' || !job.input_file || !job.output_file) {
    return (
      <PreviewState
        title={t('notReadyTitle')}
        description={t('notReadyDescription')}
        backLabel={tCommon('back')}
        onBack={handleBack}
      />
    );
  }

  if (!canPreviewTranslationJob({
    inputFile: job.input_file,
    outputFile: job.output_file,
  })) {
    return (
      <PreviewState
        title={t('unsupportedTitle')}
        description={t('unsupportedDescription')}
        backLabel={tCommon('back')}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-var(--dashboard-header-height))] flex-col px-4 md:-mx-[var(--dashboard-content-margin)] md:px-6 xl:px-8">
      <div className="border-b border-border/60 bg-muted/20 py-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="-ml-2 mb-3 gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {tCommon('back')}
          </Button>

          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {t('title')}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 py-4 lg:py-6">
        <div className="grid min-h-0 w-full grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
          <PdfPreviewPane
            fileId={job.input_file.id}
            fileName={job.input_file.name}
            title={t('original')}
            loadingLabel={t('loadingOriginal')}
            errorLabel={t('renderError')}
          />

          <PdfPreviewPane
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
