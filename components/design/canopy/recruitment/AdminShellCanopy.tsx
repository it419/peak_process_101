"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CanopyWordmark } from "@/components/design/canopy/CanopyWordmark";
import { cn } from "@/lib/utils/cn";

export function AdminShellCanopy({ adminName, children }: { adminName: string; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-canopy-bg font-canopy-sans">
      <header className="border-b border-canopy-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-8">
            <CanopyWordmark subtitle="HR Admin" />
            <nav className="hidden gap-6 sm:flex">
              <Link
                href="/admin/jobs"
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname?.startsWith("/admin/jobs")
                    ? "text-canopy-accent-text"
                    : "text-canopy-ink-muted hover:text-canopy-accent-text",
                )}
              >
                Jobs
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden text-sm text-canopy-ink-faint sm:inline">Signed in as {adminName}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-canopy-ink-muted transition-colors hover:text-canopy-accent-text"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">{children}</main>
    </div>
  );
}
