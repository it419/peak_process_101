"use client";

import { usePathname } from "next/navigation";
import { useDesignStore } from "@/lib/design/designStore";
import {
  OrganicJobDetailSkeleton,
  OrganicJobsListSkeleton,
} from "@/components/design/organic/recruitment/OrganicCareersSkeletons";

/**
 * Loading state for the public careers routes (rendered by app/jobs/**
 * loading.tsx). The Organic design has full skeletons; the other two
 * designs show their own page background so navigation doesn't flash an
 * unstyled screen.
 *
 * The skeleton is chosen from the URL being loaded, not from which
 * loading.tsx rendered it: app/jobs/loading.tsx is also the nearest
 * boundary when navigating from the list into /jobs/[id].
 */
export function CareersLoadingSwitcher() {
  const mode = useDesignStore((s) => s.mode);
  const pathname = usePathname();
  const page = pathname === "/jobs" ? "list" : "detail";

  if (mode === "organic") return page === "list" ? <OrganicJobsListSkeleton /> : <OrganicJobDetailSkeleton />;

  return (
    <div className={mode === "dark" ? "min-h-screen bg-dark-bg" : "min-h-screen bg-paper-50"} aria-busy="true">
      <p role="status" className="sr-only">
        Loading…
      </p>
    </div>
  );
}
