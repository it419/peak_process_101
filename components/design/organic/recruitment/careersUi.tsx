import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Banknote, Briefcase, Clock, MapPin, TrendingUp } from "lucide-react";
import { employmentTypeLabel, workModeLabel } from "@/lib/recruitment/constants";
import { cn } from "@/lib/utils/cn";
import type { PublicJobSummary } from "@/types/recruitment";

/** Shared building blocks for the Organic careers pages (list, detail,
 *  apply, confirmation) so repeated elements stay identical everywhere. */

/** One content column for header, hero, body and footer so their edges line up. */
export const careersContainer = "mx-auto w-full max-w-6xl px-5 sm:px-10";

/** Navigation direction tags for <Link transitionTypes> (styled in
 *  globals.css). Deeper into the flow (list → detail → apply) is forward;
 *  returning is back. */
export const NAV_FORWARD = ["organic-nav-forward"];
export const NAV_BACK = ["organic-nav-back"];

/** Shared look for the jobs search box and filter dropdowns (same height, radius, border). */
export const filterControlClass =
  "h-11 w-full rounded-organic-pill border border-organic-border-strong bg-organic-card text-sm text-organic-ink outline-none transition-[border-color,box-shadow] duration-150 hover:border-organic-ink-muted focus-visible:border-organic-accent focus-visible:ring-3 focus-visible:ring-organic-accent/20";

export function experienceRange(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) return `${min}–${max} Years`;
  if (min != null) return `${min}+ Years`;
  return `Up to ${max} Years`;
}

export function formatSalary(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `${fmt(min)}+`;
  return `Up to ${fmt(max as number)}`;
}

type Icon = typeof MapPin;

export function MetaChip({ icon: Icon, children }: { icon: Icon; children: ReactNode }) {
  return (
    <span className="organic-type-meta inline-flex items-center gap-1.5 rounded-organic-pill border border-organic-border bg-organic-bg px-3 py-1 text-organic-ink-muted">
      <Icon className="size-3.5 shrink-0 text-organic-ink-faint" aria-hidden />
      {children}
    </span>
  );
}

/** The standard chip row for a job: location, type, work mode, experience (+ salary if public). */
export function JobMetaChips({
  job,
  salary,
  className,
}: {
  job: PublicJobSummary;
  salary?: string | null;
  className?: string;
}) {
  const experience = experienceRange(job.experienceMinYears, job.experienceMaxYears);
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Role details">
      {job.location && (
        <li>
          <MetaChip icon={MapPin}>{job.location}</MetaChip>
        </li>
      )}
      <li>
        <MetaChip icon={Briefcase}>{employmentTypeLabel(job.employmentType)}</MetaChip>
      </li>
      <li>
        <MetaChip icon={Clock}>{workModeLabel(job.workMode)}</MetaChip>
      </li>
      {experience && (
        <li>
          <MetaChip icon={TrendingUp}>{experience}</MetaChip>
        </li>
      )}
      {salary && (
        <li>
          <MetaChip icon={Banknote}>{salary}</MetaChip>
        </li>
      )}
    </ul>
  );
}

function FactRow({ icon: Icon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-organic-ink-faint" aria-hidden />
      <div className="min-w-0">
        <dt className="organic-type-meta font-normal text-organic-ink-faint">{label}</dt>
        <dd className="text-[0.9375rem] font-medium text-organic-ink">{value}</dd>
      </div>
    </div>
  );
}

/** Sidebar summary card used on the detail and apply pages. */
export function JobSummaryCard({
  eyebrow,
  job,
  salary,
  children,
}: {
  eyebrow: string;
  job: PublicJobSummary;
  salary?: string | null;
  children?: ReactNode;
}) {
  const experience = experienceRange(job.experienceMinYears, job.experienceMaxYears);
  return (
    <div className="rounded-organic-card border border-organic-border bg-organic-card p-7 shadow-organic-rest">
      <p className="organic-type-eyebrow text-organic-ink-faint">{eyebrow}</p>
      <p className="organic-type-card-title mt-2 text-organic-ink">{job.title}</p>
      {job.department && <p className="organic-type-meta mt-1 text-organic-ink-muted">{job.department}</p>}

      <dl className="mt-6 flex flex-col gap-4 border-t border-organic-border pt-6">
        {job.location && <FactRow icon={MapPin} label="Location" value={job.location} />}
        <FactRow icon={Briefcase} label="Employment type" value={employmentTypeLabel(job.employmentType)} />
        <FactRow icon={Clock} label="Work mode" value={workModeLabel(job.workMode)} />
        {experience && <FactRow icon={TrendingUp} label="Experience" value={experience} />}
        {salary && <FactRow icon={Banknote} label="Salary" value={salary} />}
      </dl>

      {children}
    </div>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      transitionTypes={NAV_BACK}
      className="organic-type-meta group inline-flex max-w-full items-center gap-1.5 rounded-organic-control text-organic-ink-muted transition-colors hover:text-organic-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-organic-accent"
    >
      <ArrowLeft className="size-4 shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5" aria-hidden />
      <span className="truncate">{children}</span>
    </Link>
  );
}

/** Tinted band at the top of every careers page, flowing into the page via a curve. */
export function CareersHero({ children, size = "default" }: { children: ReactNode; size?: "default" | "large" }) {
  return (
    <div className="bg-organic-surface">
      <div
        className={cn(
          careersContainer,
          size === "large" ? "pt-16 pb-14 sm:pt-24 sm:pb-20" : "pt-14 pb-12 sm:pt-20 sm:pb-16",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Hero for the jobs list. Static copy, shared with the loading skeleton so
 *  the page doesn't shift when the real list arrives.
 *  Placeholder marketing copy: replace with approved wording. */
export function JobsHero() {
  return (
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
  );
}
