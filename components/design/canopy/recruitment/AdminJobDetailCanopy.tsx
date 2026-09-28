"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { jobStatusLabel } from "@/lib/recruitment/constants";
import { useJobStatusAction } from "@/hooks/recruitment/useJobStatusAction";
import { canopyButtonVariants } from "@/components/design/canopy/ui/CanopyButton";
import { JobFormCanopy } from "@/components/design/canopy/recruitment/AdminJobFormCanopy";
import { StatusPill, adminPanelClass } from "@/components/design/canopy/recruitment/AdminShellCanopy";
import type { JobDetail } from "@/types/recruitment";

export function AdminJobDetailCanopy({ job }: { job: JobDetail }) {
  const { changeStatus, pendingId, error } = useJobStatusAction();
  const busy = pendingId === job.id;
  const quick = canopyButtonVariants({ variant: "secondary", size: "sm" });

  // Status card at the top of the form's right column: current state, applicant
  // count and the quick status actions (status-only endpoint, as before).
  const statusCard = (
    <section className={cn(adminPanelClass, "flex flex-col gap-3.5 px-5 py-5 sm:px-6")} aria-label="Posting status">
      <div className="flex items-center justify-between gap-3">
        <StatusPill kind="job" status={job.status}>
          {jobStatusLabel(job.status)}
        </StatusPill>
        <p className="text-[0.8125rem] text-canopy-ink-muted">
          <span className="canopy-mono font-medium text-canopy-ink">{job.applicationCount}</span> application
          {job.applicationCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.status === "draft" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => changeStatus(job.id, "published")}
            className={canopyButtonVariants({ variant: "primary", size: "sm" })}
          >
            Publish
          </button>
        )}
        {job.status === "published" && (
          <>
            <button type="button" disabled={busy} onClick={() => changeStatus(job.id, "draft")} className={quick}>
              Unpublish
            </button>
            <button type="button" disabled={busy} onClick={() => changeStatus(job.id, "closed")} className={quick}>
              Close Job
            </button>
          </>
        )}
        {job.status === "closed" && (
          <button type="button" disabled={busy} onClick={() => changeStatus(job.id, "published")} className={quick}>
            Reopen
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-canopy-error" role="alert">
          {error}
        </p>
      )}

      <div className="border-t border-canopy-border pt-3">
        <Link
          href={`/admin/jobs/${job.id}/applications`}
          className="group inline-flex items-center gap-1.5 rounded-sm text-sm font-bold text-canopy-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-accent"
        >
          View Applications
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
        </Link>
      </div>
    </section>
  );

  return (
    <JobFormCanopy
      key={job.updatedAt}
      mode="edit"
      jobId={job.id}
      initialJob={job}
      title={job.title}
      lead="Update the role details, then save your changes."
      aside={statusCard}
    />
  );
}
