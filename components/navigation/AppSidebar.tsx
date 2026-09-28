"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  Menu,
  PlusCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import { PeakMark } from "@/components/Logo";
import { useDesignStore, type DesignMode } from "@/lib/design/designStore";
import { setSidebarPreference, useSidebarPreference } from "@/lib/design/sidebarPreference";
import { getStepById } from "@/lib/onboarding/steps.config";
import { useCurrentStepId } from "@/lib/store/selectors";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/* Look per design. Structure is shared; only these classes differ.   */
/* ------------------------------------------------------------------ */

interface SidebarTheme {
  surface: string; // sidebar + mobile bar background, border, base text
  brand: string;
  brandSub: string;
  section: string;
  item: string;
  itemActive: string;
  indicator: string;
  control: string; // collapse / menu / close buttons
  focus: string;
  divider: string;
  backdrop: string;
  font: string;
}

const THEMES: Record<DesignMode, SidebarTheme> = {
  current: {
    surface: "bg-ink-900 border-ink-700 text-paper-50",
    brand: "font-display text-paper-50",
    brandSub: "text-ink-400",
    section: "text-ink-400",
    item: "text-ink-200 hover:bg-ink-800 hover:text-paper-50",
    itemActive: "bg-ink-800 text-gold-400",
    indicator: "bg-gold-400",
    control: "text-ink-200 hover:bg-ink-800 hover:text-paper-50",
    focus: "focus-visible:outline-gold-400",
    divider: "border-ink-700",
    backdrop: "bg-ink-950/60",
    font: "font-sans",
  },
  dark: {
    surface: "bg-dark-surface border-dark-border text-dark-text",
    brand: "font-dark-display text-dark-text",
    brandSub: "text-dark-text-muted",
    section: "text-dark-text-muted",
    item: "text-dark-text-muted hover:bg-dark-surface-2 hover:text-dark-text",
    itemActive: "bg-dark-surface-2 text-dark-gold",
    indicator: "bg-dark-gold",
    control: "text-dark-text-muted hover:bg-dark-surface-2 hover:text-dark-text",
    focus: "focus-visible:outline-dark-gold",
    divider: "border-dark-border",
    backdrop: "bg-black/60",
    font: "font-sans",
  },
  organic: {
    surface: "bg-organic-surface border-organic-border text-organic-ink",
    brand: "font-organic-display italic text-organic-ink",
    brandSub: "text-organic-ink-faint",
    section: "text-organic-ink-faint",
    item: "text-organic-ink-muted hover:bg-organic-card hover:text-organic-ink",
    itemActive: "bg-organic-card text-organic-accent-text shadow-organic-rest",
    indicator: "bg-organic-accent",
    control: "text-organic-ink-muted hover:bg-organic-card hover:text-organic-ink",
    focus: "focus-visible:outline-organic-accent",
    divider: "border-organic-border",
    backdrop: "bg-organic-ink/40",
    font: "font-organic-ui",
  },
};

/* ------------------------------------------------------------------ */
/* Navigation model                                                   */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
  external?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

function useNavSections(): NavSection[] {
  const currentStepId = useCurrentStepId();
  const onboardingHref = `/onboarding/${getStepById(currentStepId).slug}`;

  return [
    {
      title: "Onboarding",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, isActive: (p) => p === "/dashboard" },
        { label: "Onboarding", href: onboardingHref, icon: ClipboardList, isActive: (p) => p.startsWith("/onboarding") },
      ],
    },
    {
      title: "Recruitment (HR)",
      items: [
        {
          label: "Job postings",
          href: "/admin/jobs",
          icon: Briefcase,
          isActive: (p) => p.startsWith("/admin") && p !== "/admin/jobs/new",
        },
        { label: "Post a new job", href: "/admin/jobs/new", icon: PlusCircle, isActive: (p) => p === "/admin/jobs/new" },
      ],
    },
  ];
}

const CAREERS_ITEM: NavItem = {
  label: "View careers site",
  href: "/jobs",
  icon: ExternalLink,
  isActive: () => false,
  external: true,
};

/* ------------------------------------------------------------------ */
/* Pieces                                                             */
/* ------------------------------------------------------------------ */

function Brand({ theme, compact }: { theme: SidebarTheme; compact: boolean }) {
  return (
    <Link
      href="/dashboard"
      aria-label={compact ? "Peak Process Partners — dashboard" : undefined}
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
        theme.focus,
      )}
    >
      <PeakMark className="size-8 shrink-0" />
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className={cn("block truncate text-[0.9375rem] font-semibold", theme.brand)}>Peak Process Partners</span>
          <span className={cn("mt-0.5 block truncate text-[0.6875rem] font-medium tracking-widest uppercase", theme.brandSub)}>
            Workspace
          </span>
        </span>
      )}
    </Link>
  );
}

function NavLink({
  item,
  theme,
  compact,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  theme: SidebarTheme;
  compact: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = item.isActive(pathname);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={compact ? item.label : undefined}
      className={cn(
        "relative flex h-10 items-center gap-3 rounded-lg text-sm font-medium transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
        compact ? "justify-center px-0" : "px-3",
        active ? theme.itemActive : theme.item,
        theme.focus,
      )}
    >
      {active && (
        <span aria-hidden className={cn("absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-full", theme.indicator)} />
      )}
      <Icon className="size-[1.125rem] shrink-0" aria-hidden />
      <span className={compact ? "sr-only" : "truncate"}>{item.label}</span>
    </Link>
  );
}

function NavBody({
  theme,
  compact,
  pathname,
  onNavigate,
  footer,
}: {
  theme: SidebarTheme;
  compact: boolean;
  pathname: string;
  onNavigate?: () => void;
  footer?: ReactNode;
}) {
  const sections = useNavSections();
  return (
    <>
      <nav aria-label="Main" className="mt-8 flex flex-1 flex-col gap-7 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            {compact ? (
              <div aria-hidden className={cn("mx-2 mb-3 border-t", theme.divider)} />
            ) : (
              <p className={cn("mb-2 px-3 text-[0.6875rem] font-semibold tracking-widest uppercase", theme.section)}>
                {section.title}
              </p>
            )}
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => (
                <li key={item.label}>
                  <NavLink item={item} theme={theme} compact={compact} pathname={pathname} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className={cn("mt-6 flex flex-col gap-1 border-t pt-4", theme.divider)}>
        <NavLink item={CAREERS_ITEM} theme={theme} compact={compact} pathname={pathname} onNavigate={onNavigate} />
        {footer}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                            */
/* ------------------------------------------------------------------ */

/**
 * App navigation for internal pages (dashboard, onboarding, HR admin).
 * Desktop: a sticky left sidebar that collapses to an icon rail.
 * Below the tablet breakpoint: a slim top bar whose menu button opens the
 * same navigation as a slide-in drawer. Styles follow the active design.
 */
export function AppSidebar() {
  const mode = useDesignStore((s) => s.mode);
  const theme = THEMES[mode];
  const pathname = usePathname();
  const preference = useSidebarPreference();
  // Onboarding steps already have a step rail in two of the designs, so the
  // sidebar starts as an icon rail there unless the visitor chose otherwise.
  const collapsed = preference ? preference === "collapsed" : pathname.startsWith("/onboarding/");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function closeDrawer() {
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  }

  // While the drawer is open: lock page scroll and move focus into it.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  // Keep keyboard focus inside the open drawer; Escape closes it.
  function onDrawerKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeDrawer();
      return;
    }
    if (e.key !== "Tab" || !drawerRef.current) return;
    const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const controlClass = cn(
    "inline-flex items-center justify-center rounded-lg transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
    theme.control,
    theme.focus,
  );

  return (
    <>
      {/* Mobile / small tablet: top bar with menu button. */}
      <div className={cn("flex items-center gap-3 border-b px-3 py-2.5 tablet:hidden", theme.surface, theme.font)}>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
          aria-controls={drawerId}
          aria-label="Open navigation menu"
          className={cn(controlClass, "size-10")}
        >
          <Menu className="size-5" aria-hidden />
        </button>
        <Brand theme={theme} compact={false} />
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <div className={cn("fixed inset-0 z-[90] tablet:hidden", theme.font)}>
            <motion.div
              aria-hidden
              className={cn("absolute inset-0", theme.backdrop)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={closeDrawer}
            />
            <motion.div
              ref={drawerRef}
              id={drawerId}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              onKeyDown={onDrawerKeyDown}
              className={cn(
                "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r px-4 pt-4 pb-5 shadow-2xl",
                theme.surface,
              )}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between gap-3">
                <Brand theme={theme} compact={false} />
                <button type="button" onClick={closeDrawer} aria-label="Close navigation menu" className={cn(controlClass, "size-10 shrink-0")}>
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <NavBody theme={theme} compact={false} pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop: sticky sidebar. */}
      <aside
        aria-label="App navigation"
        className={cn(
          "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r py-6 transition-[width] duration-200 ease-out motion-reduce:transition-none tablet:flex",
          collapsed ? "w-[4.5rem] px-3" : "w-64 px-4",
          theme.surface,
          theme.font,
        )}
      >
        <div className={cn("flex", collapsed ? "justify-center" : "px-1")}>
          <Brand theme={theme} compact={collapsed} />
        </div>
        <NavBody
          theme={theme}
          compact={collapsed}
          pathname={pathname}
          footer={
            <button
              type="button"
              onClick={() => setSidebarPreference(collapsed ? "expanded" : "collapsed")}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(controlClass, "h-10 gap-3 text-sm font-medium", collapsed ? "justify-center" : "justify-start px-3")}
            >
              {collapsed ? (
                <ChevronsRight className="size-[1.125rem]" aria-hidden />
              ) : (
                <>
                  <ChevronsLeft className="size-[1.125rem]" aria-hidden />
                  <span>Collapse</span>
                </>
              )}
            </button>
          }
        />
      </aside>
    </>
  );
}
