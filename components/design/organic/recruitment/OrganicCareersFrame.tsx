import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { OrganicWordmark } from "@/components/design/organic/OrganicWordmark";
import { OrganicThemeToggle } from "@/components/design/organic/OrganicThemeToggle";
import { NAV_BACK, careersContainer } from "@/components/design/organic/recruitment/careersUi";

const navTransition = {
  "organic-nav-forward": "organic-nav-forward",
  "organic-nav-back": "organic-nav-back",
};
// Real pages fade up when they appear without a direction (skeleton reveal,
// browser back/forward); skeletons fade out quickly when content replaces them.
const pageEnter = { ...navTransition, default: "organic-reveal-in" };
const pageExit = { ...navTransition, default: "none" };
const skeletonExit = { ...navTransition, default: "organic-reveal-out" };

/**
 * Page chrome shared by every public careers screen in the Organic design.
 * `data-organic-surface` opts the page into the Organic light/dark token
 * swap defined in app/globals.css. On route changes the page fades and
 * slides in the navigation direction; the header has its own
 * view-transition-name so it stays pinned (see globals.css). `skeleton`
 * marks the loading placeholder so it hands off to the real page with a
 * quick fade instead of a slide.
 */
export function OrganicCareersFrame({ children, skeleton = false }: { children: ReactNode; skeleton?: boolean }) {
  return (
    // The ViewTransition must wrap the outermost DOM node: React only runs
    // enter/exit for boundaries that aren't inside freshly inserted DOM.
    <ViewTransition enter={pageEnter} exit={skeleton ? skeletonExit : pageExit} default="none">
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
