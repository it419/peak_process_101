"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboardingStore";
import { useCompletionPercent } from "@/lib/store/selectors";
import { getStepBySlug, getStepIndex, stepRegistry } from "@/lib/onboarding/steps.config";

function CanopyShellSkeleton() {
  return (
    <div className="animate-pulse motion-reduce:animate-none">
      <div className="mb-6 hidden h-4 w-48 rounded bg-canopy-skeleton tablet:block" />
      <div className="h-3 w-24 rounded bg-canopy-skeleton" />
      <div className="mt-3 h-10 w-2/3 rounded bg-canopy-skeleton" />
      <div className="mt-3 h-4 w-1/2 rounded bg-canopy-skeleton" />
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="h-72 rounded-canopy-card bg-canopy-skeleton" />
        <div className="hidden h-44 rounded-canopy-card bg-canopy-skeleton xl:block" />
      </div>
    </div>
  );
}

export function CanopyShell({ children }: { children: ReactNode }) {
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);
  const percent = useCompletionPercent();
  const pathname = usePathname();
  const viewing = getStepBySlug(pathname.split("/").filter(Boolean)[1] ?? "");

  return (
    <div className="min-h-screen bg-canopy-bg font-canopy-sans text-canopy-ink">
      {/* Below the tablet breakpoint only: on desktop the step list and
          progress live in the app sidebar (AppSidebar), and the brand sits
          in the forest top bar above this one, so this bar only says where
          you are. */}
      <header className="sticky top-0 z-20 border-b border-canopy-border bg-canopy-card/95 backdrop-blur tablet:hidden">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <p className="text-sm font-bold text-canopy-ink">Onboarding</p>
          <p className="font-canopy-mono text-xs text-canopy-ink-muted">
            {viewing ? (
              <>
                <span className="sr-only">Step </span>
                {getStepIndex(viewing.id) + 1} / {stepRegistry.length}
                <span aria-hidden> · </span>
                <span className="sr-only">, </span>
              </>
            ) : null}
            {percent}%<span className="sr-only"> complete</span>
          </p>
        </div>
        <div aria-hidden className="h-0.5 bg-canopy-surface-2">
          <div
            className="h-full bg-canopy-accent transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[68rem] px-4 py-6 sm:px-8 sm:py-8 tablet:px-11">
        {hasHydrated ? children : <CanopyShellSkeleton />}
      </main>
    </div>
  );
}
