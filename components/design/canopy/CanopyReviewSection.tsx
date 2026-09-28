import Link from "next/link";
import type { StepStatus } from "@/types/onboarding";
import { CanopyPill } from "./CanopyStepShell";

interface CanopyReviewSectionProps {
  title: string;
  status: StepStatus;
  href: string;
  summary?: string;
}

const STATUS_LABEL: Record<StepStatus, string> = {
  completed: "Complete",
  current: "Not started",
  blocked: "Incomplete",
  upcoming: "Not started",
};

const STATUS_TONE: Record<StepStatus, "success" | "attention" | "neutral"> = {
  completed: "success",
  current: "neutral",
  blocked: "attention",
  upcoming: "neutral",
};

/** One hairline row of the review table: section + summary on the left,
 *  status pill and Edit link on the right. Wraps below `sm`. */
export function CanopyReviewSection({ title, status, href, summary }: CanopyReviewSectionProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-canopy-border py-3.5 first:pt-0.5 last:border-b-0 last:pb-0.5">
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-sm font-bold text-canopy-ink">{title}</p>
        <p className="mt-0.5 truncate text-[0.8125rem] text-canopy-ink-muted">{summary || "—"}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <CanopyPill tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</CanopyPill>
        <Link
          href={href}
          aria-label={`Edit ${title}`}
          className="rounded-sm text-[0.8125rem] font-bold text-canopy-accent-text underline-offset-4 outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-accent"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
