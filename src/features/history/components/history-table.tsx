"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowRight,
  Coins,
  Download,
  Eye,
  File,
  FileDown,
  FileInput,
  FileText,
  Loader2,
  Presentation,
} from "lucide-react";
import { jobStatusConfig } from "@/features/dashboard/data";
import { getFileDownloadUrl } from "@/features/documents/api/documents.api";
import { canPreviewTranslationJob } from "@/features/documents/utils/preview-capabilities";
import type { TranslationJobResponse } from "@/features/dashboard/api/dashboard.api";
import type { HistoryTableProps } from "../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf")
    return <FileText className="size-4 shrink-0 text-destructive" />;
  if (ext === "pptx" || ext === "ppt")
    return <Presentation className="size-4 shrink-0 text-warning" />;
  return <File className="size-4 shrink-0 text-primary" />;
}

async function triggerDownload(fileId: string, fileName: string) {
  const { download_url } = await getFileDownloadUrl(fileId);
  const anchor = document.createElement("a");
  anchor.href = download_url;
  anchor.download = fileName;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function formatLocaleDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleString(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── DownloadButton ───────────────────────────────────────────────────────────

function DownloadButton({ job }: { job: TranslationJobResponse }) {
  const tHistory = useTranslations("dashboard.history");
  const [loadingOriginal, setLoadingOriginal] = useState(false);
  const [loadingTranslated, setLoadingTranslated] = useState(false);

  const isLoading = loadingOriginal || loadingTranslated;
  const hasInput = !!job.input_file?.id;
  const hasOutput = !!job.output_file?.id;
  const inputExpired = job.input_file?.is_expired ?? false;
  const outputExpired = job.output_file?.is_expired ?? false;

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
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                ) : (
                  <Download className="size-3.5 text-muted-foreground" />
                )}
                <span className="sr-only">{tHistory("download.label")}</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              {tHistory("download.label")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Original file */}
            {hasInput &&
              (inputExpired ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <DropdownMenuItem
                        disabled
                        className="cursor-not-allowed gap-2 opacity-50"
                      >
                        <FileInput className="size-4 shrink-0" />
                        <div className="flex flex-col">
                          <span>{tHistory("download.original")}</span>
                          <span className="text-xs text-muted-foreground">
                            {tHistory("fileExpired")}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {tHistory("fileExpired")}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <DropdownMenuItem
                  className="gap-2"
                  onClick={handleDownloadOriginal}
                  disabled={loadingOriginal}
                >
                  <FileInput className="size-4 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span>{tHistory("download.original")}</span>
                    <span className="max-w-[150px] truncate text-xs text-muted-foreground">
                      {job.input_file!.name}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}

            {/* Translated file */}
            {hasOutput &&
              (outputExpired ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <DropdownMenuItem
                        disabled
                        className="cursor-not-allowed gap-2 opacity-50"
                      >
                        <FileDown className="size-4 shrink-0" />
                        <div className="flex flex-col">
                          <span>{tHistory("download.translated")}</span>
                          <span className="text-xs text-muted-foreground">
                            {tHistory("fileExpired")}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {tHistory("fileExpired")}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <DropdownMenuItem
                  className="gap-2"
                  onClick={handleDownloadTranslated}
                  disabled={loadingTranslated}
                >
                  <FileDown className="size-4 shrink-0 text-primary" />
                  <div className="flex flex-col">
                    <span>{tHistory("download.translated")}</span>
                    <span className="max-w-[150px] truncate text-xs text-muted-foreground">
                      {job.output_file!.name}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipContent>{tHistory("download.label")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── HistoryTable ─────────────────────────────────────────────────────────────

export function HistoryTable({
  jobs,
  locale,
  onViewDetails,
  compact = false,
  hideActions = false,
}: HistoryTableProps) {
  const tJobs = useTranslations("dashboard.recentJobs");
  const tStatus = useTranslations("dashboard.status");
  const tHistory = useTranslations("dashboard.history");
  const tReview = useTranslations("documents.review");

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-sm font-medium text-muted-foreground lg:px-6">
              {tJobs("fileName")}
            </TableHead>
            <TableHead className="hidden h-11 px-4 text-sm font-medium text-muted-foreground sm:table-cell lg:px-6">
              {tJobs("languages")}
            </TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-muted-foreground lg:px-6">
              {tJobs("status")}
            </TableHead>
            <TableHead
              className={`h-11 px-4 text-right text-sm font-medium text-muted-foreground lg:px-6 ${compact ? "hidden sm:table-cell" : "hidden md:table-cell"}`}
            >
              {tHistory("columns.credits")}
            </TableHead>
            {!compact && (
              <TableHead className="hidden h-11 px-4 text-sm font-medium text-muted-foreground md:table-cell lg:px-6">
                {tJobs("createdAt")}
              </TableHead>
            )}
            {!hideActions && (
              <TableHead className="h-11 px-4 text-right text-sm font-medium text-muted-foreground lg:px-6">
                {tJobs("actions")}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.map((job) => {
            const fileName = job.input_file?.name ?? job.job_id;
            const statusCfg = jobStatusConfig[job.status];
            const canPreview =
              job.status === "succeeded" &&
              !job.input_file?.is_expired &&
              !job.output_file?.is_expired &&
              canPreviewTranslationJob({
                inputFile: job.input_file,
                outputFile: job.output_file,
              });

            const handlePreview = () => {
              if (!canPreview) return;

              const previewUrl = `/${locale}/documents/preview?jobId=${encodeURIComponent(job.job_id)}`;
              window.open(previewUrl, "_blank", "noopener,noreferrer");
            };

            return (
              <TableRow
                key={job.job_id}
                className="group cursor-pointer hover:bg-muted/30"
                onClick={() => onViewDetails(job)}
              >
                <TableCell className="max-w-[180px] px-4 py-3.5 sm:max-w-[220px] lg:px-6">
                  <div className="flex items-center gap-2">
                    {getFileIcon(fileName)}
                    <span className="truncate text-sm font-medium text-foreground">
                      {fileName}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="hidden px-4 py-3.5 sm:table-cell lg:px-6">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-xs font-medium text-foreground">
                      {job.src_lang}
                    </span>
                    <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      {job.tgt_lang}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3.5 lg:px-6">
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusCfg?.className ?? ""}`}
                  >
                    {tStatus(job.status)}
                  </Badge>
                </TableCell>

                <TableCell
                  className={`px-4 py-3.5 text-right lg:px-6 ${compact ? "hidden sm:table-cell" : "hidden md:table-cell"}`}
                >
                  {job.cost_credits !== undefined ? (
                    <div className="flex items-center justify-end gap-1">
                      <Coins className="size-3.5 text-warning" />
                      <span className="text-sm font-medium tabular-nums text-foreground">
                        {job.cost_credits}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                {!compact && (
                  <TableCell className="hidden px-4 py-3.5 md:table-cell lg:px-6">
                    <span className="text-sm text-muted-foreground">
                      {formatLocaleDate(job.created_at, locale)}
                    </span>
                  </TableCell>
                )}

                {!hideActions && (
                  <TableCell
                    className="px-4 py-3.5 text-right lg:px-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <DownloadButton job={job} />
                      {canPreview && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={handlePreview}
                              >
                                <Eye className="size-3.5 text-muted-foreground" />
                                <span className="sr-only">{tReview("preview")}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{tReview("preview")}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
