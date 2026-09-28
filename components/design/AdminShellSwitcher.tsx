"use client";

import type { ReactNode } from "react";
import { useDesignStore } from "@/lib/design/designStore";
import { AdminShellCurrent } from "@/components/recruitment/AdminShellCurrent";
import { AdminShellDark } from "@/components/design/dark/recruitment/AdminShellDark";
import { AdminShellOrganic } from "@/components/design/organic/recruitment/AdminShellOrganic";
import { AdminShellCanopy } from "@/components/design/canopy/recruitment/AdminShellCanopy";

export function AdminShellSwitcher({ adminName, children }: { adminName: string; children: ReactNode }) {
  const mode = useDesignStore((s) => s.mode);

  if (mode === "dark") return <AdminShellDark adminName={adminName}>{children}</AdminShellDark>;
  if (mode === "organic") return <AdminShellOrganic adminName={adminName}>{children}</AdminShellOrganic>;
  if (mode === "canopy") return <AdminShellCanopy adminName={adminName}>{children}</AdminShellCanopy>;
  return <AdminShellCurrent adminName={adminName}>{children}</AdminShellCurrent>;
}
