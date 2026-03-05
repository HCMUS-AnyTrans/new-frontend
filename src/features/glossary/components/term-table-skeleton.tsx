import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TermTableSkeletonProps {
  showControls?: boolean;
}

export function TermTableSkeleton({ showControls = true }: TermTableSkeletonProps) {
  return (
    <>
      {/* Search + add form skeleton */}
      {showControls && (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-10 flex-1" />
          </div>
          <div className="mb-6 flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </>
      )}

      {/* Table skeleton */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 px-4 lg:px-6">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="h-11 px-4 lg:px-6">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="h-11 px-4 lg:px-6">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="px-4 py-3.5 lg:px-6">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="px-4 py-3.5 lg:px-6">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="px-4 py-3.5 lg:px-6">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
