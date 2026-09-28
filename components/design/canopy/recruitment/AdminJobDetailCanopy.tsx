"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { jobStatusLabel } from "@/lib/recruitment/constants";
import { useJobStatusAction } from "@/hooks/recruitment/useJobStatusAction";
import { canopyButtonVariants } from "@/components/design/canopy/ui/CanopyButton";
import { AdminJobFormCanopy } from "@/components/design/canopy/recruitment/AdminJobFormCanopy";
import type { JobDetail } from "@/types/recruitment";

const STATUS_TEXT: Record<string, string> = {
  draft: "text-canopy-ink-faint",
  published: "text-canopy-success",
  closed: "text-canopy-ink-muted",
};

export function AdminJobDetailCanopy({ job }: { job: JobDetail }) {
  const { changeStatus, pendingId, error } = useJobStatusAction();
  const busy = pendingId === job.id;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canopy-border pb-6">
        <div>
          <p className={cn("text-sm font-semibold tracking-wide uppercase", STATUS_TEXT[job.status])}>
            {jobStatusLabel(job.status)}
          </p>
          <p className="mt-1 text-sm text-canopy-ink-muted">
            {job.applicationCount} application{job.applicationCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/admin/jobs/${job.id}/applications`}
            className="text-sm font-medium text-canopy-accent-text hover:underline"
          >
            View Applications
          </Link>
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
              <button
                type="button"
                disabled={busy}
                onClick={() => changeStatus(job.id, "draft")}
                className={canopyButtonVariants({ variant: "secondary", size: "sm" })}
              >
                Unpublish
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => changeStatus(job.id, "closed")}
                className={canopyButtonVariants({ variant: "secondary", size: "sm" })}
              >
                Close Job
              </button>
            </>
          )}
          {job.status === "closed" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatus(job.id, "published")}
              className={canopyButtonVariants({ variant: "secondary", size: "sm" })}
            >
              Reopen
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-canopy-error">{error}</p>}

      <div className="mt-8">
        <AdminJobFormCanopy key={job.updatedAt} mode="edit" jobId={job.id} initialJob={job} />
      </div>
    </div>
  );
}
