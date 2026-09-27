import { OrganicCareersFrame } from "@/components/design/organic/recruitment/OrganicCareersFrame";
import { CareersHero, JobsHero, careersContainer, filterControlClass } from "@/components/design/organic/recruitment/careersUi";
import { CurveDivider } from "@/components/design/organic/CurveDivider";
import { cn } from "@/lib/utils/cn";

/**
 * Loading placeholders for the Organic careers pages, shown by the route
 * loading files while the server fetches jobs. Each mirrors the real
 * page's layout (same frame, container, card and spacing) so content
 * lands in place instead of shifting.
 */

function Bone({ className }: { className?: string }) {
  return <div aria-hidden className={cn("organic-skeleton rounded-organic-pill", className)} />;
}

function LoadingStatus({ label }: { label: string }) {
  return (
    <p role="status" className="sr-only">
      {label}
    </p>
  );
}

function JobCardSkeleton() {
  return (
    <li
      aria-hidden
      className="flex h-full flex-col rounded-organic-card border border-organic-border bg-organic-card p-7 shadow-organic-rest"
    >
      <Bone className="h-3 w-24" />
      <Bone className="mt-3.5 h-5 w-3/4" />
      <div className="mt-6 flex flex-wrap gap-2">
        <Bone className="h-7 w-28" />
        <Bone className="h-7 w-24" />
        <Bone className="h-7 w-20" />
      </div>
      <Bone className="mt-6 h-3.5 w-full" />
      <Bone className="mt-2.5 h-3.5 w-2/3" />
      <div className="mt-auto pt-7">
        <div className="flex items-center justify-between border-t border-organic-border pt-5">
          <Bone className="h-3.5 w-20" />
          <Bone className="h-9 w-28" />
        </div>
      </div>
    </li>
  );
}

export function OrganicJobsListSkeleton() {
  return (
    <OrganicCareersFrame skeleton>
      <JobsHero />
      <CurveDivider fill="var(--color-organic-surface)" className="-mt-px h-10 sm:h-16 md:h-20" />
      <main className={`${careersContainer} pt-12 pb-20 sm:pt-16 sm:pb-28`} aria-busy="true">
        <LoadingStatus label="Loading open positions…" />
        <div aria-hidden className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className={`${filterControlClass} flex-1`} />
          <div className={`${filterControlClass} sm:w-56`} />
          <div className={`${filterControlClass} sm:w-56`} />
        </div>
        <Bone className="mt-8 h-3.5 w-24" />
        <ul className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {[0, 1, 2, 3].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </ul>
      </main>
    </OrganicCareersFrame>
  );
}

/** Used for the job detail and apply pages (same hero + content + sidebar layout). */
export function OrganicJobDetailSkeleton() {
  return (
    <OrganicCareersFrame skeleton>
      <CareersHero>
        <div aria-hidden>
          <Bone className="h-4 w-28" />
          <Bone className="mt-8 h-3 w-28" />
          <Bone className="mt-4 h-9 w-full max-w-xl sm:h-11" />
          <Bone className="mt-3 h-9 w-2/3 max-w-sm sm:h-11" />
          <div className="mt-7 flex flex-wrap gap-2">
            <Bone className="h-7 w-28" />
            <Bone className="h-7 w-24" />
            <Bone className="h-7 w-20" />
            <Bone className="h-7 w-24" />
          </div>
        </div>
      </CareersHero>
      <CurveDivider fill="var(--color-organic-surface)" className="-mt-px h-8 sm:h-12 md:h-16" />
      <main className={`${careersContainer} pt-10 pb-20 sm:pt-14 sm:pb-28`} aria-busy="true">
        <LoadingStatus label="Loading position details…" />
        <div aria-hidden className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-16">
          <div className="flex max-w-[68ch] flex-col divide-y divide-organic-border">
            {[0, 1, 2].map((i) => (
              <div key={i} className="py-10 first:pt-0 last:pb-0">
                <Bone className="h-4.5 w-36" />
                <Bone className="mt-5 h-3.5 w-full" />
                <Bone className="mt-3 h-3.5 w-11/12" />
                <Bone className="mt-3 h-3.5 w-3/5" />
              </div>
            ))}
          </div>
          <div className="rounded-organic-card border border-organic-border bg-organic-card p-7 shadow-organic-rest">
            <Bone className="h-3 w-28" />
            <Bone className="mt-3 h-5 w-4/5" />
            <div className="mt-6 flex flex-col gap-5 border-t border-organic-border pt-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Bone className="size-4 shrink-0" />
                  <div className="flex-1">
                    <Bone className="h-3 w-20" />
                    <Bone className="mt-2 h-3.5 w-32" />
                  </div>
                </div>
              ))}
            </div>
            <Bone className="mt-7 h-12 w-full" />
          </div>
        </div>
      </main>
    </OrganicCareersFrame>
  );
}
