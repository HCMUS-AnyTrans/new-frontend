import { Skeleton } from '@/components/ui/skeleton';

interface GlossarySkeletonProps {
  showFilters?: boolean;
}

export function GlossarySkeleton({ showFilters = true }: GlossarySkeletonProps) {
  return (
    <>
      {/* Filters + button skeleton */}
      {showFilters && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-9 w-36" />
        </div>
      )}

      {/* Cards grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
