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
  showFilters?: boolean;
}

export function HistoryTableSkeleton({ showFilters = true }: HistoryTableSkeletonProps) {
  return (
    <>
      {/* Filters skeleton */}
      {showFilters && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-[160px]" />
        </div>
      )}

      {/* Table skeleton */}
      <AppCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AppCardContent padding="none" className="border-t px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-44" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </AppCardContent>
      </AppCard>
    </>
  );
}
