"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";
import { Search } from "lucide-react";
import { OrganicCareersFrame } from "@/components/design/organic/recruitment/OrganicCareersFrame";
import {
  CareersHero,
  JobMetaChips,
  NAV_FORWARD,
  careersContainer,
  filterControlClass,
} from "@/components/design/organic/recruitment/careersUi";
import { OrganicFilterSelect } from "@/components/design/organic/ui/OrganicFilterSelect";
import { CurveDivider } from "@/components/design/organic/CurveDivider";
import { organicButtonVariants } from "@/components/design/organic/ui/OrganicButton";
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
      <article className="relative flex h-full flex-col rounded-organic-card border border-organic-border bg-organic-card p-7 shadow-organic-rest transition-[box-shadow,border-color] duration-200 hover:border-organic-border-strong/50 hover:shadow-organic-lift">
        {job.department && <p className="organic-type-eyebrow text-organic-ink-faint">{job.department}</p>}
        <h2 className="organic-type-card-title mt-2 text-organic-ink">
          <Link
            href={`/jobs/${job.id}`}
            transitionTypes={NAV_FORWARD}
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
            transitionTypes={NAV_FORWARD}
              className="organic-type-meta rounded-organic-control text-organic-ink-muted transition-colors hover:text-organic-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-organic-accent"
            >
              View details
            </Link>
            <Link
              href={`/jobs/${job.id}/apply`}
              transitionTypes={NAV_FORWARD}
              className={organicButtonVariants({ variant: "primary", size: "sm" })}
            >
              Apply now
            </Link>
          </div>
        </div>
      </article>
    </motion.li>
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

  const [staggerDone, setStaggerDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setStaggerDone(true), STAGGER_WINDOW_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Honour the OS "reduce motion" setting for every Framer animation below.
    <MotionConfig reducedMotion="user">
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
            <OrganicFilterSelect
              label="Department"
              value={department}
              onChange={setDepartment}
              options={[{ value: "all", label: "All departments" }, ...departments.map((d) => ({ value: d, label: d }))]}
              className="sm:w-56"
              triggerClassName={filterControlClass}
            />
            <OrganicFilterSelect
              label="Location"
              value={location}
              onChange={setLocation}
              options={[{ value: "all", label: "All locations" }, ...locations.map((l) => ({ value: l, label: l }))]}
              className="sm:w-56"
              triggerClassName={filterControlClass}
            />
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
            <ul className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((job, index) => (
                  <JobCard key={job.id} job={job} delay={staggerDone ? 0 : index * STAGGER_S} />
                ))}
              </AnimatePresence>
            </ul>
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
    </MotionConfig>
  );
}
