"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function IssuesTableSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-9 w-28 rounded-md" />

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-48 rounded-md" />
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      <div className="grid grid-cols-5 gap-4 items-center border-b pb-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 items-center py-2 border-b"
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-5 w-20" /> 
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          <strong className="text-white">Select a project</strong> to see the issues or{" "}
          <strong className="text-white">create a project</strong> from the sidebar.
        </p>
      </div>
    </div>
  );
}
