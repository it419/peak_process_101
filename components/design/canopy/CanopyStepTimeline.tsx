"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stepRegistry } from "@/lib/onboarding/steps.config";
import { useStepStatuses } from "@/lib/store/selectors";
import type { StepStatus } from "@/types/onboarding";

const STATUS_LABEL: Record<StepStatus, string> = {
  completed: "Complete",
  current: "In progress",
  blocked: "In progress",
  upcoming: "Not started",
};

const STATUS_TEXT_TONE: Record<StepStatus, string> = {
  completed: "text-canopy-success",
  current: "text-canopy-accent-text",
  blocked: "text-canopy-gold",
  upcoming: "text-canopy-ink-faint",
};

interface CanopyStepTimelineProps {
  variant?: "trail" | "list";
  className?: string;
}

export function CanopyStepTimeline({ variant = "list", className }: CanopyStepTimelineProps) {
  const statuses = useStepStatuses();
  const pathname = usePathname();

  if (variant === "trail") {
    return (
      <nav aria-label="Onboarding steps" className={cn("flex w-full items-center", className)}>
        {stepRegistry.map((step, index) => {
          const status = statuses[step.id];
          const isLast = index === stepRegistry.length - 1;
          const href = `/onboarding/${step.slug}`;
          return (
            <div key={step.id} className={cn("flex items-center", !isLast && "flex-1")}>
              <Link
                href={href}
                aria-current={pathname === href ? "step" : undefined}
                title={step.shortLabel}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors sm:size-7 sm:text-[11px]",
                  status === "completed" && "border-canopy-accent bg-canopy-accent text-canopy-on-accent",
                  status === "current" &&
                    "border-canopy-accent bg-canopy-bg text-canopy-accent-text ring-2 ring-canopy-accent/25",
                  status === "blocked" && "border-canopy-gold/70 bg-canopy-bg text-canopy-gold",
                  status === "upcoming" && "border-canopy-border bg-canopy-bg text-canopy-ink-faint",
                )}
              >
                {status === "completed" ? <Check className="size-3" strokeWidth={3} /> : index + 1}
              </Link>
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "h-px flex-1",
                    status === "completed" ? "bg-canopy-accent/40" : "bg-canopy-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Onboarding steps" className={cn("flex flex-col", className)}>
      {stepRegistry.map((step, index) => {
        const status = statuses[step.id];
        const isLast = index === stepRegistry.length - 1;
        const href = `/onboarding/${step.slug}`;
        return (
          <Link
            key={step.id}
            href={href}
            className={cn(
              "group relative flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-canopy-surface",
              !isLast && "mb-1",
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold",
                status === "completed" && "border-canopy-accent bg-canopy-accent text-canopy-on-accent",
                status === "current" &&
                  "border-canopy-accent bg-canopy-card text-canopy-accent-text ring-2 ring-canopy-accent/20",
                status === "blocked" && "border-canopy-gold/60 bg-canopy-card text-canopy-gold",
                status === "upcoming" && "border-canopy-border bg-canopy-card text-canopy-ink-faint",
              )}
            >
              {status === "completed" ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
            </span>
            <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <span
                className={cn(
                  "font-canopy-display text-base",
                  status === "current" ? "font-semibold text-canopy-ink" : "text-canopy-ink",
                )}
              >
                {step.label}
              </span>
              <span className={cn("text-[0.8125rem] font-medium", STATUS_TEXT_TONE[status])}>
                {STATUS_LABEL[status]}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
