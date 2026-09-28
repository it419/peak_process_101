"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";
import { BriefcaseBusiness, RotateCcw, Search, SearchX } from "lucide-react";
import { CanopyCareersFrame } from "@/components/design/canopy/recruitment/CanopyCareersFrame";
import {
  JobMetaChips,
  JobsHero,
  NAV_FORWARD,
  careersContainer,
  filterControlClass,
} from "@/components/design/canopy/recruitment/careersUi";
import { CanopyFilterSelect } from "@/components/design/canopy/ui/CanopyFilterSelect";
import { CurveDivider } from "@/components/design/canopy/CurveDivider";
import { CanopyButton, canopyButtonVariants } from "@/components/design/canopy/ui/CanopyButton";
import type { PublicJobSummary } from "@/types/recruitment";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
/** Delay between consecutive cards on first load. */
const STAGGER_S = 0.065;

/** How long after first load the stagger applies. Cards that mount later
 *  (after a filter change) animate in straight away. */
const STAGGER_WINDOW_MS = 1000;

// Each card animates itself: variants set on a parent don't propagate
// through AnimatePresence, so the stagger is a per-card delay (`custom`).
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE_OUT, delay } }),
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" } },
};

function JobCard({ job, delay }: { job: PublicJobSummary; delay: number }) {
  // MotionConfig's reducedMotion only skips animations; the hover offset
  // would still jump into place, so drop it entirely for reduced motion.
  const reduceMotion = useReducedMotion();
  return (
    <motion.li
      layout
      variants={cardVariants}
      custom={delay}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.18, ease: "easeOut" } }}
      transition={{ duration: 0.18, ease: "easeOut", layout: { duration: 0.3, ease: EASE_OUT } }}
      className="h-full"
    >
      <article className="relative flex h-full flex-col rounded-canopy-card border border-canopy-border bg-canopy-card p-7 shadow-canopy-rest transition-[box-shadow,border-color] duration-200 hover:border-canopy-border-strong/50 hover:shadow-canopy-lift">
        {job.department && <p className="canopy-type-eyebrow text-canopy-ink-faint">{job.department}</p>}
        <h2 className="canopy-type-card-title mt-2 text-canopy-ink">
          <Link
            href={`/jobs/${job.id}`}
            transitionTypes={NAV_FORWARD}
            className="rounded-canopy-control transition-colors hover:text-canopy-accent-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canopy-accent"
          >
            {job.title}
          </Link>
        </h2>

        <JobMetaChips job={job} className="mt-5" />

        {job.overviewExcerpt && (
          <p className="canopy-type-body mt-5 line-clamp-2 text-canopy-ink-muted">{job.overviewExcerpt}</p>
        )}

        <div className="mt-auto pt-7">
          <div className="flex items-center justify-between gap-4 border-t border-canopy-border pt-5">
            <Link
              href={`/jobs/${job.id}`}
            transitionTypes={NAV_FORWARD}
              className="canopy-type-meta rounded-canopy-control text-canopy-ink-muted transition-colors hover:text-canopy-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canopy-accent"
            >
              View details
            </Link>
            <Link
              href={`/jobs/${job.id}/apply`}
              transitionTypes={NAV_FORWARD}
              className={canopyButtonVariants({ variant: "primary", size: "sm" })}
            >
              Apply now
            </Link>
          </div>
        </div>
      </article>
    </motion.li>
  );
}

function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: typeof SearchX;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="mt-6 flex flex-col items-center rounded-canopy-card border border-dashed border-canopy-border-strong/40 bg-canopy-card/60 px-6 py-16 text-center sm:py-20"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-canopy-surface text-canopy-ink-muted">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="canopy-type-heading mt-6 text-canopy-ink">{title}</h2>
      <p className="canopy-type-body mt-2 max-w-md text-balance text-canopy-ink-muted">{children}</p>
      {action && <div className="mt-8">{action}</div>}
    </motion.div>
  );
}

export function PublicJobsListCanopy({ jobs }: { jobs: PublicJobSummary[] }) {
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

  const searchRef = useRef<HTMLInputElement>(null);
  function clearFilters() {
    setQuery("");
    setDepartment("all");
    setLocation("all");
    // The button that was clicked disappears; keep keyboard focus in the filters.
    searchRef.current?.focus();
  }

  const roleWord = (n: number) => (n === 1 ? "role" : "roles");

  const [staggerDone, setStaggerDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setStaggerDone(true), STAGGER_WINDOW_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Honour the OS "reduce motion" setting for every Framer animation below.
    <MotionConfig reducedMotion="user">
      <CanopyCareersFrame>
        <JobsHero />
        <CurveDivider fill="var(--color-canopy-surface)" className="-mt-px h-10 sm:h-16 md:h-20" />

        <main className={`${careersContainer} pt-12 pb-20 sm:pt-16 sm:pb-28`}>
          {jobs.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <span className="sr-only">Search roles</span>
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-canopy-ink-faint"
                  aria-hidden
                />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search roles…"
                  className={`${filterControlClass} pr-4 pl-10 placeholder:text-canopy-ink-faint`}
                />
              </label>
              <CanopyFilterSelect
                label="Department"
                value={department}
                onChange={setDepartment}
                options={[{ value: "all", label: "All departments" }, ...departments.map((d) => ({ value: d, label: d }))]}
                className="sm:w-56"
                triggerClassName={filterControlClass}
              />
              <CanopyFilterSelect
                label="Location"
                value={location}
                onChange={setLocation}
                options={[{ value: "all", label: "All locations" }, ...locations.map((l) => ({ value: l, label: l }))]}
                className="sm:w-56"
                triggerClassName={filterControlClass}
              />
            </div>
          )}

          {jobs.length > 0 && (
            <div className="mt-8 flex min-h-6 flex-wrap items-center gap-x-4 gap-y-1">
              <p className="canopy-type-meta text-canopy-ink-muted" aria-live="polite">
                {hasFilters
                  ? `Showing ${filtered.length} of ${jobs.length} open ${roleWord(jobs.length)}`
                  : `${jobs.length} open ${roleWord(jobs.length)}`}
              </p>
              {hasFilters && filtered.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="canopy-type-meta rounded-canopy-control text-canopy-accent-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-accent"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {jobs.length === 0 ? (
            <EmptyState icon={BriefcaseBusiness} title="No open positions right now">
              New roles are posted here as soon as they open. Check back soon.
            </EmptyState>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No roles match your filters"
              action={
                <CanopyButton type="button" variant="secondary" onClick={clearFilters}>
                  <RotateCcw className="size-4" aria-hidden />
                  Clear filters
                </CanopyButton>
              }
            >
              Try a different search term, or clear the filters to see all {jobs.length} open{" "}
              {roleWord(jobs.length)}.
            </EmptyState>
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((job, index) => (
                  <JobCard key={job.id} job={job} delay={staggerDone ? 0 : index * STAGGER_S} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </main>

        <CurveDivider fill="var(--color-canopy-surface)" flip className="h-10 sm:h-16 md:h-20" />
        <footer className="bg-canopy-surface">
          <div className={`${careersContainer} py-12 text-center`}>
            <p className="canopy-type-meta font-normal text-canopy-ink-muted">
              Don{"’"}t see the right fit? Check back soon — we{"’"}re always growing.
            </p>
          </div>
        </footer>
      </CanopyCareersFrame>
    </MotionConfig>
  );
}
