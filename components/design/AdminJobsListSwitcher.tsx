"use client";

import { useDesignStore } from "@/lib/design/designStore";
import { AdminJobsListCurrent } from "@/components/recruitment/AdminJobsListCurrent";
import { AdminJobsListDark } from "@/components/design/dark/recruitment/AdminJobsListDark";
import { AdminJobsListOrganic } from "@/components/design/organic/recruitment/AdminJobsListOrganic";
import { AdminJobsListCanopy } from "@/components/design/canopy/recruitment/AdminJobsListCanopy";
import type { JobSummary } from "@/types/recruitment";

export function AdminJobsListSwitcher({ jobs }: { jobs: JobSummary[] }) {
  const mode = useDesignStore((s) => s.mode);

  if (mode === "dark") return <AdminJobsListDark jobs={jobs} />;
  if (mode === "organic") return <AdminJobsListOrganic jobs={jobs} />;
  if (mode === "canopy") return <AdminJobsListCanopy jobs={jobs} />;
  return <AdminJobsListCurrent jobs={jobs} />;
}
