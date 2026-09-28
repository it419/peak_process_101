import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { StepStatus } from "@/types/onboarding";

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

const STATUS_TONE: Record<StepStatus, string> = {
  completed: "text-canopy-success",
  current: "text-canopy-ink-faint",
  blocked: "text-canopy-error",
  upcoming: "text-canopy-ink-faint",
};

export function CanopyReviewSection({ title, status, href, summary }: CanopyReviewSectionProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-canopy-border py-5 last:border-b-0">
      <div className="min-w-0">
        <p className="font-canopy-display text-base font-semibold text-canopy-ink">
          {title}
          <span className={cn("ml-2.5 font-canopy-sans text-[0.8125rem] font-medium", STATUS_TONE[status])}>
            {STATUS_LABEL[status]}
          </span>
        </p>
        {summary && <p className="mt-1 truncate text-sm text-canopy-ink-muted">{summary}</p>}
      </div>
      <Link href={href} className="shrink-0 text-sm font-medium text-canopy-accent-text hover:underline">
        Edit
      </Link>
    </div>
  );
}
