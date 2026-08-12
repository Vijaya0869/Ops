import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Mirrors MetricCard / stat-tile shape: label + icon row, big value, small change line. */
export function StatCardSkeleton() {
  return (
    <Card variant="glass">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-24 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function StatCardSkeletonGrid({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Compact stat tile (icon+label row, value below) — for denser stat strips. */
export function StatTileSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-20" />
      </CardContent>
    </Card>
  );
}

/** Mirrors a property/deal/loan row card: title line, subtitle, badges, stat grid. */
export function ListRowSkeleton({ statCols = 4 }: { statCols?: number }) {
  return (
    <div className="p-4 border border-border rounded-lg bg-panel space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${statCols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: statCols }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListRowSkeletonGroup({
  count = 3,
  statCols = 4,
  className,
}: {
  count?: number;
  statCols?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ListRowSkeleton key={i} statCols={statCols} />
      ))}
    </div>
  );
}

/** Bar-chart-shaped placeholder so chart cards don't just flash a blank rectangle. */
export function ChartSkeleton({ className }: { className?: string }) {
  const heights = [55, 85, 40, 70, 50, 90, 35];
  return (
    <div className={cn("flex items-end justify-center gap-3 h-full w-full px-4 pb-2", className)}>
      {heights.map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-t-md rounded-b-none" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

/** Page title + subtitle + trailing action skeleton, matching the app's standard page header. */
export function PageHeaderSkeleton({ withActions = true }: { withActions?: boolean }) {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      {withActions && (
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-32" />
        </div>
      )}
    </div>
  );
}
