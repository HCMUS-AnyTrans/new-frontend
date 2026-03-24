'use client';

import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Presentation,
  File,
  Clock,
  CheckCircle2,
  Coins,
  ArrowRight,
  AlertCircle,
  Download,
  Eye,
} from 'lucide-react';
import { jobStatusConfig } from '@/features/dashboard/data';
import { useDownloadFile } from '@/features/documents';
import { canPreviewTranslationJob } from '@/features/documents/utils/preview-capabilities';
import { formatFileSize } from '../data';
import type { HistoryJobDetailProps } from '../types';

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FileText className="size-4 text-destructive" />;
  if (ext === 'pptx' || ext === 'ppt')
    return <Presentation className="size-4 text-warning" />;
  return <File className="size-4 text-primary" />;
}

function formatDateTime(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function HistoryJobDetail({
  job,
  open,
  onOpenChange,
  locale,
}: HistoryJobDetailProps) {
  const t = useTranslations('dashboard.history');
  const tStatus = useTranslations('dashboard.status');
  const tReview = useTranslations('documents.review');
  const { download, isDownloading } = useDownloadFile();

  if (!job) return null;

  const statusCfg = jobStatusConfig[job.status];
  const canPreview =
    job.status === 'succeeded' &&
    !job.input_file?.is_expired &&
    !job.output_file?.is_expired &&
    canPreviewTranslationJob({
      inputFile: job.input_file,
      outputFile: job.output_file,
    });

  const handlePreview = () => {
    if (!canPreview) return;

    const previewUrl = `/${locale}/documents/preview?jobId=${encodeURIComponent(job.job_id)}`;
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">{t('detail.title')}</SheetTitle>
          <SheetDescription className="font-mono text-xs break-all">
            {job.job_id}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-6">
          {/* Status + Languages */}
          <div className="flex items-center justify-between gap-4">
            <Badge
              variant="outline"
              className={`text-xs ${statusCfg?.className ?? ''}`}
            >
              {tStatus(job.status)}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <span>{job.src_lang}</span>
              <ArrowRight className="size-3.5 text-muted-foreground" />
              <span>{job.tgt_lang}</span>
            </div>
          </div>

          {/* Error */}
          {job.status === 'failed' && job.error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span className="wrap-break-word">{job.error}</span>
            </div>
          )}

          <Separator />

          {/* Timing */}
          <div className="grid gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('detail.timing')}
            </p>
            <div className="grid gap-2 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-3.5" />
                  {t('detail.createdAt')}
                </span>
                <span className="text-right text-foreground">
                  {formatDateTime(job.created_at, locale)}
                </span>
              </div>
              {job.completed_at && (
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CheckCircle2 className="size-3.5" />
                    {t('detail.completedAt')}
                  </span>
                  <span className="text-right text-foreground">
                    {formatDateTime(job.completed_at, locale)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Input file */}
          {job.input_file && (
            <>
              <div className="grid gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('detail.inputFile')}
                </p>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {getFileIcon(job.input_file.name)}
                    <div className="min-w-0 flex-1">
                      <p className="wrap-break-word text-sm font-medium text-foreground">
                        {job.input_file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(job.input_file.size_bytes)}
                      </p>
                      {job.input_file.is_expired && (
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs border-muted text-muted-foreground"
                        >
                          {t('detail.fileExpired')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!job.input_file.is_expired && (
                    <button
                      type="button"
                      onClick={() =>
                        download(job.input_file!.id, job.input_file!.name)
                      }
                      disabled={isDownloading}
                      title={t('download.original')}
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Download className="size-4" />
                    </button>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Output file */}
          {job.output_file && (
            <>
              <div className="grid gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('detail.outputFile')}
                </p>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {getFileIcon(job.output_file.name)}
                    <div className="min-w-0 flex-1">
                      <p className="wrap-break-word text-sm font-medium text-foreground">
                        {job.output_file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(job.output_file.size_bytes)}
                      </p>
                      {job.output_file.is_expired && (
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs border-muted text-muted-foreground"
                        >
                          {t('detail.fileExpired')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {canPreview && (
                      <button
                        type="button"
                        onClick={handlePreview}
                        title={tReview('preview')}
                        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:border-primary hover:text-primary"
                      >
                        <Eye className="size-4" />
                      </button>
                    )}

                    {!job.output_file.is_expired && (
                      <button
                        type="button"
                        onClick={() =>
                          download(job.output_file!.id, job.output_file!.name)
                        }
                        disabled={isDownloading}
                        title={t('download.translated')}
                        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Download className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Credits & Pricing breakdown */}
          {job.cost_credits !== undefined && (
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('detail.creditCost')}
                </p>
                <div className="flex items-center gap-1.5">
                  <Coins className="size-3.5 text-warning" />
                  <span className="font-semibold tabular-nums text-foreground">
                    {job.cost_credits}
                  </span>
                  <span className="text-xs text-muted-foreground">credits</span>
                </div>
              </div>

              {job.pricing_breakdown && job.pricing_breakdown.length > 0 && (
                <div className="rounded-lg border bg-muted/30 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                          {t('detail.breakdown.service')}
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                          {t('detail.breakdown.quantity')}
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                          {t('detail.breakdown.credits')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {job.pricing_breakdown.map((item, i) => (
                        <tr
                          key={item.code}
                          className={
                            i < job.pricing_breakdown!.length - 1
                              ? 'border-b'
                              : ''
                          }
                        >
                          <td className="px-3 py-2 text-foreground">
                            <div>{item.name}</div>
                            <div className="text-muted-foreground">
                              {item.price} / {item.unit}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                            {item.quantity.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums font-medium text-foreground">
                            {item.credits}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t bg-muted/50">
                        <td
                          colSpan={2}
                          className="px-3 py-2 font-semibold text-foreground"
                        >
                          {t('detail.breakdown.total')}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold tabular-nums text-foreground">
                          {job.cost_credits}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
