"use client";

import { useDesignStore } from "@/lib/design/designStore";
import { PublicJobsListCurrent } from "@/components/recruitment/PublicJobsListCurrent";
import { PublicJobsListDark } from "@/components/design/dark/recruitment/PublicJobsListDark";
import { PublicJobsListOrganic } from "@/components/design/organic/recruitment/PublicJobsListOrganic";
import { PublicJobsListCanopy } from "@/components/design/canopy/recruitment/PublicJobsListCanopy";
import type { PublicJobSummary } from "@/types/recruitment";

export function PublicJobsListSwitcher({ jobs }: { jobs: PublicJobSummary[] }) {
  const mode = useDesignStore((s) => s.mode);

  if (mode === "dark") return <PublicJobsListDark jobs={jobs} />;
  if (mode === "organic") return <PublicJobsListOrganic jobs={jobs} />;
  if (mode === "canopy") return <PublicJobsListCanopy jobs={jobs} />;
  return <PublicJobsListCurrent jobs={jobs} />;
}
