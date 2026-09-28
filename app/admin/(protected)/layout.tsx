import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/server/adminSession";
import { AdminShellSwitcher } from "@/components/design/AdminShellSwitcher";
import { AppFrame } from "@/components/navigation/AppFrame";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AppFrame>
      <AdminShellSwitcher adminName={admin.fullName}>{children}</AdminShellSwitcher>
    </AppFrame>
  );
}
