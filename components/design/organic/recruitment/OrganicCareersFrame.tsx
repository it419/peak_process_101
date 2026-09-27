import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { OrganicWordmark } from "@/components/design/organic/OrganicWordmark";
import { OrganicThemeToggle } from "@/components/design/organic/OrganicThemeToggle";
import { NAV_BACK, careersContainer } from "@/components/design/organic/recruitment/careersUi";

const pageTransition = {
  "organic-nav-forward": "organic-nav-forward",
  "organic-nav-back": "organic-nav-back",
  default: "none",
};

/**
 * Page chrome shared by every public careers screen in the Organic design.
 * `data-organic-surface` opts the page into the Organic light/dark token
 * swap defined in app/globals.css. On route changes the page fades and
 * slides in the navigation direction; the header has its own
 * view-transition-name so it stays pinned (see globals.css).
 */
export function OrganicCareersFrame({ children }: { children: ReactNode }) {
  return (
    // The ViewTransition must wrap the outermost DOM node: React only runs
    // enter/exit for boundaries that aren't inside freshly inserted DOM.
    <ViewTransition enter={pageTransition} exit={pageTransition} default="none">
      <div data-organic-surface="" className="min-h-screen bg-organic-bg font-organic-ui text-organic-ink">
        <header className="border-b border-organic-border" style={{ viewTransitionName: "organic-careers-header" }}>
          <div className={`${careersContainer} flex items-center justify-between gap-4 py-5`}>
            <Link
              href="/jobs"
              transitionTypes={NAV_BACK}
              className="min-w-0 rounded-organic-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-organic-accent"
            >
              <OrganicWordmark subtitle="Careers" />
            </Link>
            <OrganicThemeToggle />
          </div>
        </header>
        {children}
      </div>
    </ViewTransition>
  );
}
