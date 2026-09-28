"use client";

import { useDesignStore } from "@/lib/design/designStore";
import { AdminApplicationsListCurrent } from "@/components/recruitment/AdminApplicationsListCurrent";
import { AdminApplicationsListDark } from "@/components/design/dark/recruitment/AdminApplicationsListDark";
import { AdminApplicationsListOrganic } from "@/components/design/organic/recruitment/AdminApplicationsListOrganic";
import { AdminApplicationsListCanopy } from "@/components/design/canopy/recruitment/AdminApplicationsListCanopy";
import type { ApplicationSummary } from "@/types/recruitment";

interface AdminApplicationsListSwitcherProps {
  jobTitle: string;
  applications: ApplicationSummary[];
}

export function AdminApplicationsListSwitcher(props: AdminApplicationsListSwitcherProps) {
  const mode = useDesignStore((s) => s.mode);

  if (mode === "dark") return <AdminApplicationsListDark {...props} />;
  if (mode === "organic") return <AdminApplicationsListOrganic {...props} />;
  if (mode === "canopy") return <AdminApplicationsListCanopy {...props} />;
  return <AdminApplicationsListCurrent {...props} />;
}
