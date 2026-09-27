"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { OrganicCareersFrame } from "@/components/design/organic/recruitment/OrganicCareersFrame";
import { CareersHero, JobMetaChips, careersContainer } from "@/components/design/organic/recruitment/careersUi";
import { CurveDivider } from "@/components/design/organic/CurveDivider";
import { organicButtonVariants } from "@/components/design/organic/ui/OrganicButton";
import type { PublicJobSummary } from "@/types/recruitment";

/** Shared look for the search box and both filter selects (same height, radius, border). */
const filterControlClass =
  "h-11 w-full rounded-organic-pill border border-organic-border-strong bg-organic-card text-sm text-organic-ink outline-none transition-[border-color,box-shadow] duration-150 hover:border-organic-ink-muted focus:border-organic-accent focus:ring-3 focus:ring-organic-accent/20";

function JobCard({ job }: { job: PublicJobSummary }) {
  return (
    <article className="group relative flex h-full flex-col rounded-organic-card border border-organic-border bg-organic-card p-7 shadow-organic-rest transition-[translate,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-organic-border-strong/50 hover:shadow-organic-lift">
      {job.department && <p className="organic-type-eyebrow text-organic-ink-faint">{job.department}</p>}
      <h2 className="organic-type-card-title mt-2 text-organic-ink">
        <Link
          href={`/jobs/${job.id}`}
          className="rounded-organic-control transition-colors hover:text-organic-accent-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-organic-accent"
        >
          {job.title}
        </Link>
      </h2>

      <JobMetaChips job={job} className="mt-5" />

      {job.overviewExcerpt && (
        <p className="organic-type-body mt-5 line-clamp-2 text-organic-ink-muted">{job.overviewExcerpt}</p>
      )}

      <div className="mt-auto pt-7">
        <div className="flex items-center justify-between gap-4 border-t border-organic-border pt-5">
          <Link
            href={`/jobs/${job.id}`}
            className="organic-type-meta rounded-organic-control text-organic-ink-muted transition-colors hover:text-organic-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-organic-accent"
          >
            View details
          </Link>
          <Link href={`/jobs/${job.id}/apply`} className={organicButtonVariants({ variant: "primary", size: "sm" })}>
            Apply now
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PublicJobsListOrganic({ jobs }: { jobs: PublicJobSummary[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [location, setLocation] = useState("all");

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.department).filter((d): d is string => Boolean(d)))).sort(),
    [jobs],
  );
  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location).filter((l): l is string => Boolean(l)))).sort(),
    [jobs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter(
      (j) =>
        (department === "all" || j.department === department) &&
        (location === "all" || j.location === location) &&
        (q === "" || j.title.toLowerCase().includes(q) || (j.department ?? "").toLowerCase().includes(q)),
    );
  }, [jobs, query, department, location]);

  const hasFilters = query !== "" || department !== "all" || location !== "all";
  const roleWord = (n: number) => (n === 1 ? "role" : "roles");

  return (
    <OrganicCareersFrame>
      <CareersHero size="large">
        <div className="max-w-2xl">
          <p className="organic-type-eyebrow text-organic-accent-text">Open positions</p>
          <h1 className="organic-type-display mt-5 text-organic-ink">Find work that moves people forward.</h1>
          <p className="organic-type-lead mt-6 max-w-xl text-organic-ink-muted">
            Join a team redefining operational excellence — explore open roles across engineering, operations, and
            beyond.
          </p>
        </div>
      </CareersHero>
      <CurveDivider fill="var(--color-organic-surface)" className="-mt-px h-10 sm:h-16 md:h-20" />

      <main className={`${careersContainer} pt-12 pb-20 sm:pt-16 sm:pb-28`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search roles</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-organic-ink-faint"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles…"
              className={`${filterControlClass} pr-4 pl-10 placeholder:text-organic-ink-faint`}
            />
          </label>
          <label className="sm:w-56">
            <span className="sr-only">Department</span>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className={`${filterControlClass} px-4`}>
              <option value="all">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="sm:w-56">
            <span className="sr-only">Location</span>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={`${filterControlClass} px-4`}>
              <option value="all">All locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>

        {jobs.length > 0 && (
          <p className="organic-type-meta mt-8 text-organic-ink-muted" aria-live="polite">
            {hasFilters
              ? `Showing ${filtered.length} of ${jobs.length} open ${roleWord(jobs.length)}`
              : `${jobs.length} open ${roleWord(jobs.length)}`}
          </p>
        )}

        {filtered.length === 0 ? (
          <p className="organic-type-body mt-6 text-organic-ink-muted">
            {jobs.length > 0 && hasFilters
              ? "No roles match your filters."
              : "There are no open positions right now — check back soon."}
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>

      <CurveDivider fill="var(--color-organic-surface)" flip className="h-10 sm:h-16 md:h-20" />
      <footer className="bg-organic-surface">
        <div className={`${careersContainer} py-12 text-center`}>
          <p className="organic-type-meta font-normal text-organic-ink-muted">
            Don{"’"}t see the right fit? Check back soon — we{"’"}re always growing.
          </p>
        </div>
      </footer>
    </OrganicCareersFrame>
  );
}
