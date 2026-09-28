"use client";

import { useDesignStore } from "@/lib/design/designStore";
import { CompletionScreen } from "@/components/onboarding/CompletionScreen";
import { DarkCompletionScreen } from "@/components/design/dark/DarkCompletionScreen";
import { OrganicCompletionScreen } from "@/components/design/organic/OrganicCompletionScreen";
import { CanopyCompletionScreen } from "@/components/design/canopy/CanopyCompletionScreen";

export function CompletionSwitcher() {
  const mode = useDesignStore((s) => s.mode);

  if (mode === "dark") return <DarkCompletionScreen />;
  if (mode === "organic") return <OrganicCompletionScreen />;
  if (mode === "canopy") return <CanopyCompletionScreen />;
  return <CompletionScreen />;
}
