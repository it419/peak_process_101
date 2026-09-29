"use client";

import { useDesignStore } from "@/lib/design/designStore";
import { AdminLoginCurrent } from "@/components/recruitment/AdminLoginCurrent";
import { AdminLoginDark } from "@/components/design/dark/recruitment/AdminLoginDark";
import { AdminLoginOrganic } from "@/components/design/organic/recruitment/AdminLoginOrganic";
import { AdminLoginCanopy } from "@/components/design/canopy/recruitment/AdminLoginCanopy";

export function AdminLoginSwitcher() {
  const mode = useDesignStore((s) => s.mode);

  if (mode === "dark") return <AdminLoginDark />;
  if (mode === "organic") return <AdminLoginOrganic />;
  if (mode === "canopy") return <AdminLoginCanopy />;
  return <AdminLoginCurrent />;
}
