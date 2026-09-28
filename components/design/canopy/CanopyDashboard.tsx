"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useOnboardingStore } from "@/lib/store/onboardingStore";
import {
  useCompletionPercent,
  useCurrentStepId,
  useFullName,
  useRequiredDocumentsRemaining,
} from "@/lib/store/selectors";
import { getStepById } from "@/lib/onboarding/steps.config";
import { CanopyWordmark } from "./CanopyWordmark";
import { CanopyStepTimeline } from "./CanopyStepTimeline";
import { CurveDivider } from "./CurveDivider";

function CanopyDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-3 w-32 rounded bg-canopy-surface" />
      <div className="h-9 w-2/3 rounded bg-canopy-surface" />
      <div className="h-4 w-1/2 rounded bg-canopy-surface" />
    </div>
  );
}

export function CanopyDashboard() {
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);
  const submitted = useOnboardingStore((s) => s.submitted);
  const fullName = useFullName();
  const percent = useCompletionPercent();
  const currentStepId = useCurrentStepId();
  const currentStep = getStepById(currentStepId);
  const remainingDocs = useRequiredDocumentsRemaining();
  const firstName = fullName ? (fullName.trim().split(/\s+/)[0] ?? null) : null;

  return (
    <div className="min-h-screen bg-canopy-bg font-canopy-sans">
      <header className="border-b border-canopy-border px-5 py-5 sm:px-10">
        <CanopyWordmark />
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        {!hasHydrated ? (
          <CanopyDashboardSkeleton />
        ) : (
          <>
            <div className="rounded-[1.75rem] bg-canopy-surface px-6 py-10 sm:px-12 sm:py-14">
              <p className="text-[0.8125rem] font-semibold tracking-widest text-canopy-accent-text uppercase">
                Peak Process Partners
              </p>
              <h1 className="font-canopy-display mt-3 text-[2rem] leading-tight font-semibold text-canopy-ink sm:text-[2.5rem]">
                {submitted ? (
                  <>You{"’"}re all set{firstName ? `, ${firstName}` : ""}.</>
                ) : firstName ? (
                  <>
                    Welcome back, <span className="text-canopy-accent-text italic">{firstName}</span>.
                  </>
                ) : (
                  <>Welcome to Peak Process Partners.</>
                )}
              </h1>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-canopy-ink-muted">
                {submitted
                  ? "Your onboarding has been submitted to HR. We’ll be in touch if anything else is needed."
                  : `You’re ${percent}% of the way through.`}
              </p>

              <div className="mt-6 h-1.5 max-w-sm overflow-hidden rounded-full bg-canopy-surface-2">
                <div
                  className="h-full rounded-full bg-canopy-accent transition-[width] duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {!submitted && (
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <Link
                    href={fullName ? `/onboarding/${currentStep.slug}` : "/onboarding/welcome"}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-canopy-accent px-6 text-sm font-medium text-canopy-on-accent transition-colors hover:bg-canopy-accent-hover"
                  >
                    Continue onboarding {"→"}
                  </Link>
                  <p className="text-sm text-canopy-ink-muted">
                    Current step: <span className="font-medium text-canopy-ink">{currentStep.label}</span>
                  </p>
                </div>
              )}

              {!submitted && percent > 0 && remainingDocs > 0 && (
                <p className="mt-5 text-sm text-canopy-ink-muted">
                  {remainingDocs} required document{remainingDocs > 1 ? "s" : ""} still need
                  {remainingDocs > 1 ? "" : "s"} uploading.
                </p>
              )}
            </div>
            <CurveDivider fill="var(--color-canopy-surface)" className="-mt-px h-8 sm:h-12 md:h-16" />

            <div className={cn("mt-8 sm:pl-10 lg:pl-16")}>
              <h2 className="font-canopy-display text-xl font-semibold text-canopy-ink">All steps</h2>
              <div className="mt-6">
                <CanopyStepTimeline variant="list" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
