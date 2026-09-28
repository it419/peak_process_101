"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/* Small pieces shared by every Canopy HR admin screen.               */
/* ------------------------------------------------------------------ */

/** White "work" panel: hairline border, 12px corners, low shadow. */
export const adminPanelClass = "rounded-canopy-card border border-canopy-border bg-canopy-card shadow-canopy-rest";

/** Serif page title + optional muted lead, as on the Ledger app screens. */
export function AdminPageHeading({
  title,
  lead,
  action,
  className,
}: {
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="font-canopy-display text-[2rem] leading-[1.1] font-semibold tracking-[-0.015em] text-balance text-canopy-ink sm:text-[2.5rem]">
          {title}
        </h1>
        {lead && <p className="mt-2 max-w-3xl text-[0.9375rem] leading-relaxed text-canopy-ink-muted sm:text-base">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const JOB_STATUS_PILL: Record<string, string> = {
  published: "bg-canopy-accent-tint text-canopy-accent-text",
  draft: "bg-canopy-gold-tint text-canopy-gold",
  closed: "bg-canopy-surface-2 text-canopy-ink-muted",
};

const APPLICATION_STATUS_PILL: Record<string, string> = {
  applied: "bg-canopy-surface-2 text-canopy-ink-muted",
  under_review: "bg-canopy-gold-tint text-canopy-gold",
  shortlisted: "bg-canopy-gold-tint text-canopy-gold",
  interview: "bg-canopy-gold-tint text-canopy-gold",
  selected: "bg-canopy-success-tint text-canopy-success",
  rejected: "bg-canopy-error-tint text-canopy-error",
};

/** Status pill with a leading dot (published = pine, draft = brass, closed = neutral). */
export function StatusPill({
  kind,
  status,
  children,
  className,
}: {
  kind: "job" | "application";
  status: string;
  children: ReactNode;
  className?: string;
}) {
  const tone = (kind === "job" ? JOB_STATUS_PILL : APPLICATION_STATUS_PILL)[status] ?? JOB_STATUS_PILL.closed;
  return (
    <span
      className={cn(
        "inline-flex h-6.5 items-center gap-1.5 rounded-canopy-pill px-2.5 text-xs font-bold whitespace-nowrap",
        tone,
        className,
      )}
    >
      <span className="size-1.75 shrink-0 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}

/** Team / department pill (pine text on sage). */
export function TeamPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center truncate rounded-canopy-pill bg-canopy-surface px-2.5 py-1 text-xs font-bold text-canopy-accent-text">
      {children}
    </span>
  );
}

/** Keyboard hint shown inside search boxes. */
export function KbdHint({ children }: { children: ReactNode }) {
  return (
    <kbd className="pointer-events-none rounded-[5px] border border-canopy-border-strong/60 px-1.5 font-canopy-mono text-xs text-canopy-ink-muted">
      {children}
    </kbd>
  );
}

/* ------------------------------------------------------------------ */
/* Breadcrumbs — derived from the route, so pages don't pass them.    */
/* ------------------------------------------------------------------ */

interface Crumb {
  label: string;
  href?: string;
}

function crumbsFor(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean); // ["admin", ...]
  const root: Crumb = { label: "Recruitment" };
  const postings: Crumb = { label: "Job postings", href: "/admin/jobs" };

  if (parts[1] === "jobs") {
    if (parts.length === 2) return [root, { label: "Job postings" }];
    if (parts[2] === "new") return [root, postings, { label: "New job" }];
    if (parts[3] === "applications") {
      return [root, postings, { label: "Edit job", href: `/admin/jobs/${parts[2]}` }, { label: "Applications" }];
    }
    return [root, postings, { label: "Edit job" }];
  }
  if (parts[1] === "applications") return [root, postings, { label: "Application" }];
  return [root];
}

export function AdminShellCanopy({ adminName, children }: { adminName: string; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname ?? "");

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-canopy-bg font-canopy-ui text-canopy-ink">
      <div className="mx-auto w-full max-w-[80rem] px-4 pt-4 pb-12 sm:px-8 sm:pt-6 lg:px-11 lg:pt-7.5">
        {/* Slim Ledger top row: where you are on the left, who you are on the right. */}
        <div className="mb-5 flex min-h-9 items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[0.8125rem] text-canopy-ink-muted">
              {crumbs.map((crumb, index) => {
                const last = index === crumbs.length - 1;
                return (
                  <Fragment key={`${crumb.label}-${index}`}>
                    {index > 0 && (
                      <li aria-hidden className="text-canopy-ink-faint">
                        /
                      </li>
                    )}
                    <li className="min-w-0">
                      {last ? (
                        <span aria-current="page" className="font-semibold text-canopy-ink">
                          {crumb.label}
                        </span>
                      ) : crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="rounded-sm transition-colors hover:text-canopy-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-accent"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        crumb.label
                      )}
                    </li>
                  </Fragment>
                );
              })}
            </ol>
          </nav>

          <div className="flex shrink-0 items-center gap-3 text-[0.8125rem]">
            <span className="hidden text-canopy-ink-muted sm:inline">
              Signed in as <span className="font-semibold text-canopy-ink">{adminName}</span>
            </span>
            <span className="hidden h-4 w-px bg-canopy-border sm:block" aria-hidden />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-canopy-control px-1 py-1 font-semibold text-canopy-ink-muted transition-colors hover:text-canopy-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-accent"
            >
              <LogOut className="size-3.5" aria-hidden />
              Log out
            </button>
          </div>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}
