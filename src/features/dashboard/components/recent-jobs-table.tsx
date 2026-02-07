"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, ArrowRight, FileText, Subtitles } from "lucide-react";
import { mockRecentJobs, languageCodeMap } from "../data";

export function RecentJobsTable() {
  const t = useTranslations("dashboard.recentJobs");
  const tStatus = useTranslations("dashboard.status");
  const locale = useLocale();

  const statusConfig: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    processing: "bg-info/10 text-info border-info/20",
    succeeded: "bg-success/10 text-success border-success/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
  };

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
              {mockRecentJobs.map((job) => {
                return (
                  <TableRow key={job.id} className="group">
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-center gap-2">
                        {job.jobType === "document" ? (
                          <FileText className="size-4 shrink-0 text-primary" />
                        ) : (
                          <Subtitles className="size-4 shrink-0 text-accent" />
                        )}
                        <span className="truncate text-sm font-medium text-foreground">
                          {job.fileName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          job.jobType === "document"
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-accent/20 bg-accent/10 text-accent"
                        }`}
                      >
                        {job.jobType === "document"
                          ? t("document")
                          : t("subtitle")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-foreground">
                        <span className="font-mono text-xs font-medium">
                          {languageCodeMap[job.srcLang] ||
                            job.srcLang.toUpperCase()}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-mono text-xs font-medium">
                          {languageCodeMap[job.tgtLang] ||
                            job.tgtLang.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusConfig[job.status] || ""}`}
                      >
                        {tStatus(job.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm tabular-nums text-foreground">
                        {job.costCredits > 0
                          ? job.costCredits.toLocaleString(
                              locale === "vi" ? "vi-VN" : "en-US"
                            )
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {job.createdAt}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {job.status === "succeeded" && (
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
