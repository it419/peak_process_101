"use client";

import { useDesignStore } from "@/lib/design/designStore";
import { ApplicationConfirmationCurrent } from "@/components/recruitment/ApplicationConfirmationCurrent";
import { ApplicationConfirmationDark } from "@/components/design/dark/recruitment/ApplicationConfirmationDark";
import { ApplicationConfirmationOrganic } from "@/components/design/organic/recruitment/ApplicationConfirmationOrganic";
import { ApplicationConfirmationCanopy } from "@/components/design/canopy/recruitment/ApplicationConfirmationCanopy";

interface ApplicationConfirmationSwitcherProps {
  jobTitle: string;
  reference: string;
}

export function ApplicationConfirmationSwitcher(props: ApplicationConfirmationSwitcherProps) {
  const mode = useDesignStore((s) => s.mode);

  if (mode === "dark") return <ApplicationConfirmationDark {...props} />;
  if (mode === "organic") return <ApplicationConfirmationOrganic {...props} />;
  if (mode === "canopy") return <ApplicationConfirmationCanopy {...props} />;
  return <ApplicationConfirmationCurrent {...props} />;
}
