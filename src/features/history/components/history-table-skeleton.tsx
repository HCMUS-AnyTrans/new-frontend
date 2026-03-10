import { Skeleton } from '@/components/ui/skeleton';
import { AppCard, AppCardContent } from '@/components/ui/app-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface HistoryTableSkeletonProps {
  /** When true, also renders filter skeletons above the table (default: true) */
  showFilters?: boolean;
  rowCount?: number;
}

export function HistoryTableSkeleton({
  showFilters = true,
  rowCount = 8,
}: HistoryTableSkeletonProps) {
  return (
    <>
      {/* Filter bar: search + domain + status */}
      {showFilters && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full sm:w-[160px]" />
          <Skeleton className="h-10 w-full sm:w-[160px]" />
        </div>
      )}

      <AppCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                {/* File Name — always visible */}
                <TableHead className="h-11 px-4 lg:px-6">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                {/* Languages — sm+ */}
                <TableHead className="hidden h-11 px-4 sm:table-cell lg:px-6">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                {/* Status — always visible */}
                <TableHead className="h-11 px-4 lg:px-6">
                  <Skeleton className="h-4 w-14" />
                </TableHead>
                {/* Credits — md+ */}
                <TableHead className="hidden h-11 px-4 md:table-cell lg:px-6">
                  <Skeleton className="ml-auto h-4 w-14" />
                </TableHead>
                {/* Created At — md+ */}
                <TableHead className="hidden h-11 px-4 md:table-cell lg:px-6">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                {/* Actions — always visible */}
                <TableHead className="h-11 px-4 lg:px-6">
                  <Skeleton className="ml-auto h-4 w-14" />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i}>
                  {/* File Name */}
                  <TableCell className="px-4 py-3.5 lg:px-6">
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-4 shrink-0 rounded" />
                      <Skeleton className="h-4 w-32 sm:w-44" />
                    </div>
                  </TableCell>
                  {/* Languages — sm+ */}
                  <TableCell className="hidden px-4 py-3.5 sm:table-cell lg:px-6">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-6" />
                      <Skeleton className="size-3 rounded-full" />
                      <Skeleton className="h-4 w-6" />
                    </div>
                  </TableCell>
                  {/* Status */}
                  <TableCell className="px-4 py-3.5 lg:px-6">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  {/* Credits — md+ */}
                  <TableCell className="hidden px-4 py-3.5 md:table-cell lg:px-6">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="size-3.5 rounded" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </TableCell>
                  {/* Created At — md+ */}
                  <TableCell className="hidden px-4 py-3.5 md:table-cell lg:px-6">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  {/* Actions */}
                  <TableCell className="px-4 py-3.5 lg:px-6">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="size-7 rounded-md" />
                      <Skeleton className="size-7 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer skeleton */}
        <AppCardContent padding="none" className="border-t px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-44" />
            <div className="flex items-center gap-2">
              <Skeleton className="hidden size-8 rounded-md sm:block" />
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="hidden size-8 rounded-md sm:block" />
            </div>
          </div>
        </AppCardContent>
      </AppCard>
    </>
  );
}
