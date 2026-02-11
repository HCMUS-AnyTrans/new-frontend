"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, ArrowRight, FileText, Subtitles } from "lucide-react";
import { languageCodeMap } from "../data";
import { useRecentJobs } from "../hooks";

function RecentJobsTableSkeleton() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {Array.from({ length: 7 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentJobsTable() {
  const t = useTranslations("dashboard.recentJobs");
  const tStatus = useTranslations("dashboard.status");
  const locale = useLocale();
  const { jobsData, isLoading, isError } = useRecentJobs({
    limit: 7,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const statusConfig: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    processing: "bg-info/10 text-info border-info/20",
    succeeded: "bg-success/10 text-success border-success/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
  };

  if (isLoading) return <RecentJobsTableSkeleton />;
  if (isError || !jobsData) return <RecentJobsTableSkeleton />;

  const jobs = jobsData.data;

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          {t("title")}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-sm text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/history">
            {t("viewAll")}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">
                  {t("fileName")}
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  {t("type")}
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  {t("languages")}
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  {t("status")}
                </TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">
                  {t("credits")}
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  {t("createdAt")}
                </TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">
                  {t("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const fileName =
                  job.input_file?.name || job.job_id;
                const jobType = job.job_type;
                const srcLang = job.src_lang;
                const tgtLang = job.tgt_lang;
                const status = job.status;
                const createdAt = new Date(job.created_at).toLocaleString(
                  locale === "vi" ? "vi-VN" : "en-US",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <TableRow key={job.job_id} className="group">
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-center gap-2">
                        {jobType === "document" ? (
                          <FileText className="size-4 shrink-0 text-primary" />
                        ) : (
                          <Subtitles className="size-4 shrink-0 text-accent" />
                        )}
                        <span className="truncate text-sm font-medium text-foreground">
                          {fileName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          jobType === "document"
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-accent/20 bg-accent/10 text-accent"
                        }`}
                      >
                        {jobType === "document"
                          ? t("document")
                          : t("subtitle")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-foreground">
                        <span className="font-mono text-xs font-medium">
                          {languageCodeMap[srcLang] ||
                            srcLang.toUpperCase()}
                        </span>
                        <span className="text-muted-foreground">{"\u2192"}</span>
                        <span className="font-mono text-xs font-medium">
                          {languageCodeMap[tgtLang] ||
                            tgtLang.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusConfig[status] || ""}`}
                      >
                        {tStatus(status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm tabular-nums text-foreground">
                        {job.input_file
                          ? job.input_file.size_bytes > 0
                            ? job.input_file.size_bytes.toLocaleString(
                                locale === "vi" ? "vi-VN" : "en-US"
                              )
                            : "\u2014"
                          : "\u2014"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {createdAt}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {status === "succeeded" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <Download className="size-3.5 text-muted-foreground" />
                            <span className="sr-only">{t("download")}</span>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="size-3.5 text-muted-foreground" />
                          <span className="sr-only">{t("viewDetails")}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
