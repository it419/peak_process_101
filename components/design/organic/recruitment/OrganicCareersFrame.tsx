import Link from "next/link";
import type { ReactNode } from "react";
import { OrganicWordmark } from "@/components/design/organic/OrganicWordmark";
import { OrganicThemeToggle } from "@/components/design/organic/OrganicThemeToggle";

/**
 * Page chrome shared by every public careers screen in the Organic design.
 * `data-organic-surface` opts the page into the Organic light/dark token
 * swap defined in app/globals.css.
 */
export function OrganicCareersFrame({ children }: { children: ReactNode }) {
  return (
    <div data-organic-surface="" className="min-h-screen bg-organic-bg font-organic-sans text-organic-ink">
      <header className="border-b border-organic-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-10">
          <Link
            href="/jobs"
            className="min-w-0 rounded-organic-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-organic-accent"
          >
            <OrganicWordmark subtitle="Careers" />
          </Link>
          <OrganicThemeToggle />
        </div>
      </header>
      {children}
    </div>
  );
}
