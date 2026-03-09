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
  /**
   * When true, renders the full glossary-detail page skeleton:
   * back button → header → add-term form → search header → table.
   * When false, renders only the table body (used inside the AppCard).
   */
  showControls?: boolean;
  rowCount?: number;
}

function TableBodySkeleton({ rowCount }: { rowCount: number }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 lg:px-6">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="h-11 px-4 lg:px-6">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="h-11 w-[180px] px-4 lg:px-6">
              <Skeleton className="ml-auto h-4 w-16" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="px-4 py-3.5 lg:px-6">
                <Skeleton className="h-4 w-full max-w-[200px]" />
              </TableCell>
              <TableCell className="px-4 py-3.5 lg:px-6">
                <Skeleton className="h-4 w-full max-w-[200px]" />
              </TableCell>
              <TableCell className="px-4 py-3.5 lg:px-6">
                <div className="flex justify-end gap-1">
                  <Skeleton className="size-8 rounded-md" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function TermTableSkeleton({
  showControls = true,
  rowCount = 8,
}: TermTableSkeletonProps) {
  if (!showControls) {
    return <TableBodySkeleton rowCount={rowCount} />;
  }

  return (
    <>
      {/* Back button */}
      <div className="mb-4">
        <Skeleton className="h-8 w-28" />
      </div>

      {/* Glossary header: icon + title/meta + bulk import button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 sm:w-64" />
            <Skeleton className="h-4 w-56 sm:w-72" />
          </div>
        </div>
        <Skeleton className="h-9 w-full sm:w-32 shrink-0" />
      </div>

      {/* Add term form */}
      <div className="mb-6 rounded-2xl border bg-card p-5">
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-9 w-full sm:w-28 shrink-0" />
        </div>
      </div>

      {/* Term table card */}
      <div className="overflow-hidden rounded-xl border bg-card">
        {/* Search header */}
        <div className="border-b bg-muted/40 px-4 py-3 lg:px-6">
          <Skeleton className="h-9 w-full max-w-sm" />
        </div>

        {/* Table */}
        <TableBodySkeleton rowCount={rowCount} />
      </div>
    </>
  );
}
