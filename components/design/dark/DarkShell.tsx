"use client";

import type { ReactNode } from "react";
import { useOnboardingStore } from "@/lib/store/onboardingStore";
import { DarkMobileStepBar } from "./DarkMobileStepBar";

function DarkShellSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl animate-pulse space-y-4 px-5 py-14 tablet:px-12">
      <div className="h-3 w-24 rounded bg-dark-surface-2" />
      <div className="h-9 w-2/3 rounded bg-dark-surface-2" />
      <div className="mt-8 h-64 rounded-xl bg-dark-surface" />
    </div>
  );
}

export function DarkShell({ children }: { children: ReactNode }) {
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);

  return (
    <div className="min-h-screen bg-dark-bg font-sans">
      {/* Desktop step list + progress live in the app sidebar (AppSidebar). */}
      <DarkMobileStepBar className="tablet:hidden" />
      <main className="min-w-0">
        <div className="mx-auto w-full max-w-2xl px-5 py-10 tablet:px-12 tablet:py-16">
          {hasHydrated ? children : <DarkShellSkeleton />}
        </div>
      </main>
    </div>
  );
}
