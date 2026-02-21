import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Eye, FileText } from 'lucide-react';
import { languageCodeMap, jobStatusConfig } from '@/features/dashboard/data';
import type { HistoryTableProps } from '../types';

export function HistoryTable({ jobs, locale }: HistoryTableProps) {
  const tJobs = useTranslations('dashboard.recentJobs');
  const tStatus = useTranslations('dashboard.status');

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium text-muted-foreground">
              {tJobs('fileName')}
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">
              {tJobs('type')}
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">
              {tJobs('languages')}
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">
              {tJobs('status')}
            </TableHead>
            <TableHead className="text-right text-xs font-medium text-muted-foreground">
              {tJobs('credits')}
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">
              {tJobs('createdAt')}
            </TableHead>
            <TableHead className="text-right text-xs font-medium text-muted-foreground">
              {tJobs('actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const fileName = job.input_file?.name || job.job_id;
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
              <TableRow key={job.job_id} className="group">
                <TableCell className="max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 shrink-0 text-primary" />
                    <span className="truncate text-sm font-medium text-foreground">
                      {fileName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/20 bg-primary/10 text-primary"
                  >
                    {tJobs('document')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-foreground">
                    <span className="font-mono text-xs font-medium">
                      {languageCodeMap[job.src_lang] ||
                        job.src_lang?.toUpperCase()}
                    </span>
                    <span className="text-muted-foreground">{'\u2192'}</span>
                    <span className="font-mono text-xs font-medium">
                      {languageCodeMap[job.tgt_lang] ||
                        job.tgt_lang?.toUpperCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusCfg?.className || ''}`}
                  >
                    {tStatus(status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm tabular-nums text-foreground">
                    {job.input_file && job.input_file.size_bytes > 0
                      ? job.input_file.size_bytes.toLocaleString(
                          locale === 'vi' ? 'vi-VN' : 'en-US'
                        )
                      : '\u2014'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {createdAt}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {status === 'succeeded' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                      >
                        <Download className="size-3.5 text-muted-foreground" />
                        <span className="sr-only">{tJobs('download')}</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7">
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
