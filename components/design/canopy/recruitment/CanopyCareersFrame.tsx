import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { CanopyWordmark } from "@/components/design/canopy/CanopyWordmark";
import { CanopyThemeToggle } from "@/components/design/canopy/CanopyThemeToggle";
import { NAV_BACK, careersContainer } from "@/components/design/canopy/recruitment/careersUi";

const navTransition = {
  "canopy-nav-forward": "canopy-nav-forward",
  "canopy-nav-back": "canopy-nav-back",
};
// Real pages fade up when they appear without a direction (skeleton reveal,
// browser back/forward); skeletons fade out quickly when content replaces them.
const pageEnter = { ...navTransition, default: "canopy-reveal-in" };
const pageExit = { ...navTransition, default: "none" };
const skeletonExit = { ...navTransition, default: "canopy-reveal-out" };

/**
 * Page chrome shared by every public careers screen in the Canopy design.
 * `data-canopy-surface` opts the page into the Canopy light/dark token
 * swap defined in app/globals.css. On route changes the page fades and
 * slides in the navigation direction; the header has its own
 * view-transition-name so it stays pinned (see globals.css). `skeleton`
 * marks the loading placeholder so it hands off to the real page with a
 * quick fade instead of a slide.
 */
export function CanopyCareersFrame({ children, skeleton = false }: { children: ReactNode; skeleton?: boolean }) {
  return (
    // The ViewTransition must wrap the outermost DOM node: React only runs
    // enter/exit for boundaries that aren't inside freshly inserted DOM.
    <ViewTransition enter={pageEnter} exit={skeleton ? skeletonExit : pageExit} default="none">
      <div data-canopy-surface="" className="min-h-screen bg-canopy-bg font-canopy-ui text-canopy-ink">
        <header className="border-b border-canopy-border" style={{ viewTransitionName: "canopy-careers-header" }}>
          <div className={`${careersContainer} flex items-center justify-between gap-4 py-5`}>
            <Link
              href="/jobs"
              transitionTypes={NAV_BACK}
              className="min-w-0 rounded-canopy-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canopy-accent"
            >
              <CanopyWordmark subtitle="Careers" />
            </Link>
            <CanopyThemeToggle />
          </div>
        </header>
        {children}
      </div>
    </ViewTransition>
  );
}
