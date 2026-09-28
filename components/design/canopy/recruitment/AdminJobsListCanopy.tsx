"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { employmentTypeLabel, jobStatusLabel, workModeLabel } from "@/lib/recruitment/constants";
import { useJobStatusAction } from "@/hooks/recruitment/useJobStatusAction";
import { canopyButtonVariants } from "@/components/design/canopy/ui/CanopyButton";
import {
  AdminPageHeading,
  KbdHint,
  StatusPill,
  TeamPill,
  adminPanelClass,
} from "@/components/design/canopy/recruitment/AdminShellCanopy";
import type { JobSummary } from "@/types/recruitment";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** yyyy-mm-dd → "31 Oct 2026" without a timezone shift. */
function formatDeadline(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function todayYmd(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function experienceRange(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) return `${min}–${max} Years`;
  if (min != null) return `${min}+ Years`;
  return `Up to ${max} Years`;
}

type StatusFilter = "all" | "published" | "draft" | "closed";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "closed", label: "Closed" },
];

function Kpi({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className={cn(adminPanelClass, "flex flex-col gap-1.5 px-4.5 py-4")}>
      <p className="text-xs font-bold tracking-[0.04em] text-canopy-ink-muted">{label}</p>
      <p className="canopy-mono text-2xl font-medium text-canopy-ink">{value}</p>
      <p className="text-xs text-canopy-ink-muted">{note}</p>
    </div>
  );
}

export function AdminJobsListCanopy({ jobs }: { jobs: JobSummary[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const searchRef = useRef<HTMLInputElement>(null);
  const { changeStatus, pendingId, error } = useJobStatusAction();

  // "/" jumps to the search box (Ledger convention), unless already typing somewhere.
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => {
    const today = todayYmd();
    const c = { all: jobs.length, published: 0, draft: 0, closed: 0, live: 0, applicants: 0 };
    for (const j of jobs) {
      c[j.status] += 1;
      c.applicants += j.applicationCount;
      if (j.status === "published" && (!j.deadline || j.deadline >= today)) c.live += 1;
    }
    return c;
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter(
      (j) =>
        (statusFilter === "all" || j.status === statusFilter) &&
        (!q ||
          j.title.toLowerCase().includes(q) ||
          (j.department ?? "").toLowerCase().includes(q) ||
          (j.location ?? "").toLowerCase().includes(q)),
    );
  }, [jobs, query, statusFilter]);

  return (
    <div>
      <AdminPageHeading
        title="Job postings"
        lead="Everything that’s live on the careers site, plus drafts in progress."
        action={
          <Link href="/admin/jobs/new" className={canopyButtonVariants({ variant: "primary" })}>
            <Plus className="size-4" aria-hidden /> Post a job
          </Link>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4">
        <Kpi
          label="Published"
          value={counts.published}
          note={counts.live === counts.published ? "On the careers site" : `${counts.live} live on the careers site`}
        />
        <Kpi label="Drafts" value={counts.draft} note="Only visible to HR" />
        <Kpi label="Closed" value={counts.closed} note="No longer taking applications" />
        <Kpi label="Applicants" value={counts.applicants} note="Across all postings" />
      </div>

      <div className="mt-5.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter by status"
          className="flex max-w-full gap-1 self-start overflow-x-auto rounded-canopy-card bg-canopy-surface-2 p-1 text-[0.8125rem] font-semibold"
        >
          {FILTERS.map((f) => {
            const active = statusFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  "rounded-[9px] px-3 py-1.5 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-canopy-accent",
                  active
                    ? "bg-canopy-card text-canopy-ink shadow-canopy-rest"
                    : "text-canopy-ink-muted hover:text-canopy-ink",
                )}
              >
                {f.label} <span className="canopy-mono font-medium">{counts[f.value]}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-canopy-ink-faint"
            aria-hidden
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search postings"
            aria-label="Search postings"
            aria-keyshortcuts="/"
            className="h-10 w-full rounded-canopy-control border border-canopy-border-strong bg-canopy-card pr-10 pl-10 text-sm text-canopy-ink outline-none placeholder:text-canopy-ink-faint hover:border-canopy-ink-muted focus:border-canopy-accent focus:ring-3 focus:ring-canopy-accent/20 [&::-webkit-search-cancel-button]:hidden"
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2">
            <KbdHint>/</KbdHint>
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-canopy-error" role="alert">
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className={cn(adminPanelClass, "mt-3 px-6 py-12 text-center")}>
          <p className="font-canopy-display text-xl font-semibold text-canopy-ink">
            {jobs.length === 0 ? "No job postings yet" : "Nothing matches"}
          </p>
          <p className="mt-1.5 text-sm text-canopy-ink-muted">
            {jobs.length === 0 ? "No job openings yet — create your first one." : "No jobs match your search."}
          </p>
        </div>
      ) : (
        <div className={cn(adminPanelClass, "mt-3 overflow-hidden")}>
          {/* Column headings — desktop table only; rows stack below `xl` (the sidebar eats width on tablets). */}
          <div
            className="hidden grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_auto] items-center gap-4 border-b border-canopy-border bg-canopy-table-head px-5 py-3 text-[0.6875rem] font-bold tracking-widest text-canopy-ink-muted uppercase xl:grid"
            aria-hidden
          >
            <span>Role</span>
            <span>Team</span>
            <span>Status</span>
            <span>Applicants</span>
            <span>Deadline</span>
            <span className="w-52" />
          </div>

          <ul>
            {filtered.map((job) => {
              const sub = [
                job.location,
                employmentTypeLabel(job.employmentType),
                workModeLabel(job.workMode),
                experienceRange(job.experienceMinYears, job.experienceMaxYears),
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <li
                  key={job.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2.5 border-b border-canopy-border px-4 py-4 last:border-b-0 sm:px-5 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_auto] xl:py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="rounded-sm text-[0.9375rem] font-bold text-canopy-ink hover:text-canopy-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-accent"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-0.5 text-[0.8125rem] text-canopy-ink-muted">{sub}</p>
                  </div>

                  <div className="hidden min-w-0 xl:block">
                    {job.department ? <TeamPill>{job.department}</TeamPill> : <span className="text-canopy-ink-faint">—</span>}
                  </div>

                  <div className="justify-self-end xl:justify-self-start">
                    <StatusPill kind="job" status={job.status}>
                      {jobStatusLabel(job.status)}
                    </StatusPill>
                  </div>

                  {/* Mobile: team, applicants and deadline share one meta line. */}
                  <div className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8125rem] text-canopy-ink-muted xl:contents">
                    {job.department && (
                      <span className="xl:hidden">
                        <TeamPill>{job.department}</TeamPill>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-canopy-ink xl:block">
                      <Users className="size-3.5 text-canopy-ink-faint xl:hidden" aria-hidden />
                      <span className="canopy-mono text-[0.8125rem]">{job.applicationCount}</span>
                      <span className="text-canopy-ink-muted xl:hidden">
                        applicant{job.applicationCount === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="min-w-0 xl:block">
                      <span className="canopy-mono block text-[0.8125rem] whitespace-nowrap text-canopy-ink">
                        <span className="font-canopy-ui text-canopy-ink-muted xl:hidden">Deadline </span>
                        {job.deadline ? formatDeadline(job.deadline) : "—"}
                      </span>
                      <span className="canopy-mono hidden text-xs whitespace-nowrap text-canopy-ink-faint xl:block">
                        Created {formatDate(job.createdAt)}
                      </span>
                    </span>
                  </div>

                  <div className="col-span-2 flex flex-wrap items-center gap-2 xl:col-span-1 xl:w-52 xl:flex-nowrap xl:justify-end">
                    {job.status === "draft" && (
                      <button
                        type="button"
                        disabled={pendingId === job.id}
                        onClick={() => changeStatus(job.id, "published")}
                        className={canopyButtonVariants({ variant: "ghost", className: "px-1 text-[0.8125rem]" })}
                      >
                        Publish
                      </button>
                    )}
                    {job.status !== "draft" && (
                      <Link
                        href={`/admin/jobs/${job.id}/applications`}
                        className={canopyButtonVariants({ variant: "ghost", className: "px-1 text-[0.8125rem]" })}
                      >
                        Applications
                      </Link>
                    )}
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      aria-label={`Edit ${job.title}`}
                      className={canopyButtonVariants({ variant: "secondary", size: "sm", className: "h-8.5 px-3" })}
                    >
                      <Pencil className="size-3.5" aria-hidden /> Edit
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
