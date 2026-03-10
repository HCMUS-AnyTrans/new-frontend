import { Skeleton } from '@/components/ui/skeleton';

interface GlossarySkeletonProps {
  /** Set false when the filters bar is already rendered above (default: true) */
  showFilters?: boolean;
  count?: number;
}

function GlossaryCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4">
      {/* Header: icon + name/domain + menu button */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="size-8 rounded-full shrink-0" />
      </div>

      {/* Language pair box */}
      <div className="flex items-center gap-3 rounded-xl border bg-muted/50 p-3">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="size-6 rounded-full shrink-0" />
        <Skeleton className="h-4 flex-1" />
      </div>

      {/* Footer: term count + date */}
      <div className="flex items-center justify-between border-t pt-4">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-24" />
      </div>
    </div>
  );
}

export function GlossarySkeleton({
  showFilters = true,
  count = 6,
}: GlossarySkeletonProps) {
  return (
    <>
      {showFilters && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full sm:w-[160px]" />
          <Skeleton className="h-10 w-full sm:w-[160px]" />
          <Skeleton className="h-9 w-full sm:w-36" />
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <GlossaryCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
