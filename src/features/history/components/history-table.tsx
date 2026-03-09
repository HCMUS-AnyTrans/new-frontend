'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Download,
  Eye,
  FileText,
  File,
  Presentation,
  Coins,
  Loader2,
  FileDown,
  FileInput,
} from 'lucide-react';
import { jobStatusConfig } from '@/features/dashboard/data';
import { getFileDownloadUrl } from '@/features/documents/api/documents.api';
import type { TranslationJobResponse } from '@/features/dashboard/api/dashboard.api';
import type { HistoryTableProps } from '../types';

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FileText className="size-4 shrink-0 text-destructive" />;
  if (ext === 'pptx' || ext === 'ppt')
    return <Presentation className="size-4 shrink-0 text-warning" />;
  return <File className="size-4 shrink-0 text-primary" />;
}

async function triggerDownload(fileId: string, fileName: string) {
  const { download_url } = await getFileDownloadUrl(fileId);
  const anchor = document.createElement('a');
  anchor.href = download_url;
  anchor.download = fileName;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function DownloadButton({ job }: { job: TranslationJobResponse }) {
  const tHistory = useTranslations('dashboard.history');
  const [loadingOriginal, setLoadingOriginal] = useState(false);
  const [loadingTranslated, setLoadingTranslated] = useState(false);

  const isLoading = loadingOriginal || loadingTranslated;
  const outputExpired = job.output_file?.is_expired ?? false;
  const inputExpired = job.input_file?.is_expired ?? false;
  const hasOutput = !!job.output_file?.id;
  const hasInput = !!job.input_file?.id;

  const handleDownloadOriginal = useCallback(async () => {
    if (!hasInput || loadingOriginal) return;
    setLoadingOriginal(true);
    try {
      await triggerDownload(job.input_file!.id, job.input_file!.name);
    } finally {
      setLoadingOriginal(false);
    }
  }, [hasInput, loadingOriginal, job.input_file]);

  const handleDownloadTranslated = useCallback(async () => {
    if (!hasOutput || outputExpired || loadingTranslated) return;
    setLoadingTranslated(true);
    try {
      await triggerDownload(job.output_file!.id, job.output_file!.name);
    } finally {
      setLoadingTranslated(false);
    }
  }, [hasOutput, outputExpired, loadingTranslated, job.output_file]);

  if (!hasInput && !hasOutput) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          ) : (
            <Download className="size-3.5 text-muted-foreground" />
          )}
          <span className="sr-only">{tHistory('download.label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {tHistory('download.label')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Original */}
        {hasInput ? (
          inputExpired ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <DropdownMenuItem
                      disabled
                      className="cursor-not-allowed gap-2 opacity-50"
                    >
                      <FileInput className="size-4 shrink-0" />
                      <div className="flex flex-col">
                        <span>{tHistory('download.original')}</span>
                        <span className="text-xs text-muted-foreground">
                          {tHistory('fileExpired')}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {tHistory('fileExpired')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <DropdownMenuItem
              className="gap-2"
              onClick={handleDownloadOriginal}
              disabled={loadingOriginal}
            >
              <FileInput className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-col">
                <span>{tHistory('download.original')}</span>
                <span className="truncate text-xs text-muted-foreground max-w-[150px]">
                  {job.input_file!.name}
                </span>
              </div>
            </DropdownMenuItem>
          )
        ) : null}

        {/* Translated */}
        {hasOutput ? (
          outputExpired ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <DropdownMenuItem
                      disabled
                      className="cursor-not-allowed gap-2 opacity-50"
                    >
                      <FileDown className="size-4 shrink-0" />
                      <div className="flex flex-col">
                        <span>{tHistory('download.translated')}</span>
                        <span className="text-xs text-muted-foreground">
                          {tHistory('fileExpired')}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {tHistory('fileExpired')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <DropdownMenuItem
              className="gap-2"
              onClick={handleDownloadTranslated}
              disabled={loadingTranslated}
            >
              <FileDown className="size-4 shrink-0 text-primary" />
              <div className="flex flex-col">
                <span>{tHistory('download.translated')}</span>
                <span className="truncate text-xs text-muted-foreground max-w-[150px]">
                  {job.output_file!.name}
                </span>
              </div>
            </DropdownMenuItem>
          )
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HistoryTable({ jobs, locale, onViewDetails }: HistoryTableProps) {
  const tJobs = useTranslations('dashboard.recentJobs');
  const tStatus = useTranslations('dashboard.status');
  const tHistory = useTranslations('dashboard.history');

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-sm font-medium text-muted-foreground lg:px-6">
              {tJobs('fileName')}
            </TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-muted-foreground lg:px-6">
              {tJobs('languages')}
            </TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-muted-foreground lg:px-6">
              {tJobs('status')}
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-sm font-medium text-muted-foreground lg:px-6">
              {tHistory('columns.credits')}
            </TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-muted-foreground lg:px-6">
              {tJobs('createdAt')}
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-sm font-medium text-muted-foreground lg:px-6">
              {tJobs('actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const fileName = job.input_file?.name ?? job.job_id;
            const status = job.status;
            const statusCfg = jobStatusConfig[status];
            const createdAt = new Date(job.created_at).toLocaleString(
              locale === 'vi' ? 'vi-VN' : 'en-US',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }
            );

            return (
              <TableRow key={job.job_id} className="group hover:bg-muted/30">
                {/* File name */}
                <TableCell className="max-w-[220px] px-4 py-3.5 lg:px-6">
                  <div className="flex items-center gap-2">
                    {getFileIcon(fileName)}
                    <span className="truncate text-sm font-medium text-foreground">
                      {fileName}
                    </span>
                  </div>
                </TableCell>

                {/* Languages */}
                <TableCell className="px-4 py-3.5 lg:px-6">
                  <div className="flex items-center gap-1 text-sm text-foreground">
                    <span className="text-xs font-medium">{job.src_lang}</span>
                    <span className="text-muted-foreground">{'\u2192'}</span>
                    <span className="text-xs font-medium">{job.tgt_lang}</span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="px-4 py-3.5 lg:px-6">
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusCfg?.className ?? ''}`}
                  >
                    {tStatus(status)}
                  </Badge>
                </TableCell>

                {/* Credits */}
                <TableCell className="px-4 py-3.5 text-right lg:px-6">
                  {job.cost_credits !== undefined ? (
                    <div className="flex items-center justify-end gap-1">
                      <Coins className="size-3.5 text-warning" />
                      <span className="text-sm tabular-nums text-foreground font-medium">
                        {job.cost_credits}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">{'\u2014'}</span>
                  )}
                </TableCell>

                {/* Created at */}
                <TableCell className="px-4 py-3.5 lg:px-6">
                  <span className="text-sm text-muted-foreground">{createdAt}</span>
                </TableCell>

                {/* Actions */}
                <TableCell className="px-4 py-3.5 text-right lg:px-6">
                  <div className="flex items-center justify-end gap-1">
                    <DownloadButton job={job} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onViewDetails(job)}
                    >
                      <Eye className="size-3.5 text-muted-foreground" />
                      <span className="sr-only">{tJobs('viewDetails')}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
