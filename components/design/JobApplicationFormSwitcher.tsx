"use client";

import { useDesignStore } from "@/lib/design/designStore";
import { JobApplicationFormCurrent } from "@/components/recruitment/JobApplicationFormCurrent";
import { JobApplicationFormDark } from "@/components/design/dark/recruitment/JobApplicationFormDark";
import { JobApplicationFormOrganic } from "@/components/design/organic/recruitment/JobApplicationFormOrganic";
import { JobApplicationFormCanopy } from "@/components/design/canopy/recruitment/JobApplicationFormCanopy";
import type { PublicJobDetail } from "@/types/recruitment";

export function JobApplicationFormSwitcher({ job }: { job: PublicJobDetail }) {
  const mode = useDesignStore((s) => s.mode);

  if (mode === "dark") return <JobApplicationFormDark job={job} />;
  if (mode === "organic") return <JobApplicationFormOrganic job={job} />;
  if (mode === "canopy") return <JobApplicationFormCanopy job={job} />;
  return <JobApplicationFormCurrent job={job} />;
}
