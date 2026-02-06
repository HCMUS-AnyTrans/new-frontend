"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, Eye, ArrowRight, FileText, Subtitles } from "lucide-react"
import { mockRecentJobs, jobStatusConfig, languageCodeMap } from "@/data/dashboard"

export function RecentJobsTable() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Jobs gần đây
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-sm text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/history">
            Xem tất cả
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
                  Tên file
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Loại
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Ngôn ngữ
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Trạng thái
                </TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">
                  Credits
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Ngày tạo
                </TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentJobs.map((job) => {
                const status = jobStatusConfig[job.status]
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
                        {job.jobType === "document" ? "Tài liệu" : "Phụ đề"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-foreground">
                        <span className="font-mono text-xs font-medium">
                          {languageCodeMap[job.srcLang] || job.srcLang.toUpperCase()}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-mono text-xs font-medium">
                          {languageCodeMap[job.tgtLang] || job.tgtLang.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${status?.className || ""}`}
                      >
                        {status?.label || job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm tabular-nums text-foreground">
                        {job.costCredits > 0
                          ? job.costCredits.toLocaleString("vi-VN")
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
                            <span className="sr-only">Tải xuống</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <Eye className="size-3.5 text-muted-foreground" />
                          <span className="sr-only">Xem chi tiết</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
